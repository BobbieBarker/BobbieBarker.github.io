---
title: 'Design GenServers for Test Isolation'
date: '2026-06-18'
excerpt: 'A GenServer registered under a fixed global atom can only exist once per VM. If you want async tests, you have to design the process boundary for isolation.'
tags: ['elixir', 'otp', 'testing', 'dependency-injection']
draft: true
readingTime: '16 min'
authors: ['Chad King']
---

```elixir
defmodule MyApp.Inventory.Server do
  use GenServer

  def start_link(_opts),
    do: GenServer.start_link(__MODULE__, nil, name: __MODULE__)
end
```

Every Elixir codebase with a few OTP abstractions grows one of these. It starts innocently. You have a process that owns a little state, maybe it does some background work, maybe it wraps an external service, and because production only ever needs one of them, you register it under the module name. The supervision tree is simple. The caller API is simple. Everything looks fine right up until the tests arrive.

Then the test suite starts telling you the truth. Two tests cannot start the same globally named process at the same time. A test that mutates the process state leaks into the next test. A cache table created under a named ETS atom survives longer than the test that created it. A mock configured through `Application.put_env/3` changes behavior for the whole VM. Eventually someone reaches for `async: false` because it makes the failures go away.

That is a band aid for bad process design.

You will often hear that code which was not designed for testing is hard to test after the fact. OTP makes this especially literal. A GenServer is not only code. It is a process with a name, a mailbox, state, timers, dependencies, and sometimes storage. If those things are global, your tests are going to share them. If your tests share them, the suite is going to be flaky. If the suite is flaky, the team is going to serialize tests and call it stability.

This is fixable, and it does not take much. It comes down to two techniques, and most of the work is knowing which one a given dependency calls for. The running example is `MyApp.Inventory`, a per-warehouse process that tracks on-hand stock, reserves units, and periodically reconciles against an upstream supplier. It has enough real shape to need both: a name and a clock that get injected, storage and an HTTP supplier that get sandboxed.

The goal here is narrow. Each test should own the resources it mutates, so the suite can run in parallel without tests stepping on each other.

## The miserable test

Here is the kind of test that looks reasonable until the suite starts running in parallel:

```elixir
defmodule MyApp.Inventory.ServerTest do
  use ExUnit.Case, async: true

  setup do
    start_supervised!(MyApp.Inventory.Server)
    :ok
  end

  test "reserves stock" do
    assert :ok = MyApp.Inventory.Server.reserve("sku-1", 2)
  end
end
```

The test says `async: true`, but the design says something else. The server has one fixed name. The test does not choose it. The process can only exist once per VM. If another test starts the same server, one of them loses. If the process is already running because the application supervision tree started it, this test is not isolated from the application either.

You can make this pass by setting `async: false`, but you have not made the code more testable. You have only taught ExUnit to avoid the collision.

## Two ways to isolate a test

Every problem in that test traces back to the same habit. The process reaches out and grabs what it depends on. It grabs its own name from the module. It reaches for the supplier and the clock by their module names. It opens an ETS table under a hardcoded atom. None of those dependencies are visible to the caller, so none of them are under the test's control.

Giving the test control comes down to two techniques, and most of the skill is knowing which one a dependency calls for.

The first is **sandboxing**, and when a dependency offers it, it is almost always the answer. Ecto, Req, and `elixir_cache` all ship one, because the idea fits testing so well: the library keeps each test's data in its own namespace and works out which one to use from the process doing the asking, so tests stay isolated, run concurrently, and the production call site never changes. More on exactly how that works below.

The second is **dependency injection**, for everything that has no sandbox. Instead of letting the process reach for a dependency, you hand it in as an argument, and the test hands in one it controls. The name carries more weight than the idea deserves. There is no framework and no container. A dependency is a value and a module is a value, so injecting one means passing it as an argument and using whatever came through.

The rest of this article works through `MyApp.Inventory` one dependency at a time, and every choice falls out of a single question: does this boundary already come with a sandbox, or not? The name has to be injected, because nothing sandboxes a process name. Storage and the supplier get sandboxed. Time gets injected, because nothing sandboxes the clock.

## The name is the first dependency

Wrong:

```elixir
defmodule MyApp.Inventory.Server do
  use GenServer

  def start_link(_opts),
    do: GenServer.start_link(__MODULE__, nil, name: __MODULE__)
end
```

Correct:

```elixir
defmodule MyApp.Inventory.Server do
  use GenServer

  def start_link(%{name: name} = opts) do
    GenServer.start_link(__MODULE__, opts, name: name)
  end
end
```

Start here, because until the name is an argument, nothing else you do can isolate the process. A GenServer registered under a fixed global atom can only have one instance in the VM. The second you make the name configurable, production still gets the obvious name and tests can choose a unique one per test.

```elixir
setup do
  name = :"inventory_#{System.unique_integer([:positive])}"

  start_supervised!(
    {MyApp.Inventory.Server,
     %{
       name: name,
       warehouse_id: "wh-1"
     }}
  )

  {:ok, server: name}
end
```

The caller API should also accept the server:

```elixir
def reserve(server, sku, qty),
  do: GenServer.call(server, {:reserve, sku, qty})

def on_hand(server, sku),
  do: GenServer.call(server, {:on_hand, sku})
```

That small choice changes the test surface. The test no longer has to find the one process everyone else is also using. It starts its own process, talks to its own name, and ExUnit can schedule the test alongside other tests doing the same thing.

The name has no sandbox to fall back on, so injecting it is the only option. Most of a process's other dependencies do have one.

## Sandboxing

Two of `MyApp.Inventory`'s dependencies, its storage and the supplier it calls over HTTP, never get injected at all. They get sandboxed.

Storage is where teams most often reintroduce a global right after fixing the process name.

Wrong:

```elixir
defmodule MyApp.Inventory.Server do
  use GenServer

  def init(_opts) do
    :ets.new(:inventory_cache, [:named_table, :public, read_concurrency: true])
    {:ok, %{}}
  end

  def handle_call({:get, key}, _from, state) do
    {:reply, :ets.lookup(:inventory_cache, key), state}
  end
end
```

The server is now welded to a named ETS table. Parameterizing the GenServer name does not help. Two tests still touch the same table, cleanup turns into a teardown problem, and a future move to another backend becomes a rewrite instead of an adapter swap.

A cache library with a sandbox adapter solves all of that without an injected `cache:` argument anywhere:

```elixir
defmodule MyApp.Inventory.Cache do
  use Cache,
    adapter: Cache.ETS,
    name: :inventory_cache,
    sandbox?: Mix.env() == :test,
    opts: [read_concurrency: true]
end
```

Nothing injects this. Code calls `Cache.get/1` and `Cache.put/2` by name. In production those hit ETS. Under test, `sandbox?` routes them through a per-test namespace instead.

That namespace is the whole trick, and it is worth understanding because the same mechanism powers every sandbox you will use. The library keeps each owner's data separate and decides which slice a call belongs to by looking at the process making the call and walking its `$callers` and `$ancestors` back to a process that registered as an owner. A test registers itself as the owner in its setup. From then on, anything that process does, plus anything done by processes it started, resolves to that test's slice and no other. Because every test is its own owner, the suite runs concurrently with nothing shared to fight over, and the call sites stay free of all of it.

The supplier works the same way, through Req. Instead of a client hidden behind an injected behaviour, it is an ordinary module that calls `Req` and reads its options from config:

```elixir
defmodule MyApp.Inventory.Supplier do
  @spec fetch_levels(String.t()) ::
          {:ok, %{optional(String.t()) => non_neg_integer()}} | {:error, :unavailable}
  def fetch_levels(warehouse_id) do
    [base_url: "https://supplier.internal", url: "/warehouses/#{warehouse_id}/levels"]
    |> Keyword.merge(Application.get_env(:my_app, :supplier_req_options, []))
    |> Req.request()
    |> case do
      {:ok, %{status: 200, body: levels}} -> {:ok, levels}
      _ -> {:error, :unavailable}
    end
  end
end
```

Production config points it at the real service. Test config points it at `Req.Test`:

```elixir
# config/test.exs
config :my_app, supplier_req_options: [plug: {Req.Test, MyApp.Inventory.Supplier}]
```

`Req.Test` uses the same ownership model as the cache sandbox, the one Mox uses too, so a test can install a stub and stay `async: true`. The production code never learns any of this happened. It calls `Supplier.fetch_levels/1`, which calls `Req`, and that is the end of it.

The same option exists for the database. `Ecto.Adapters.SQL.Sandbox` checks out a connection per test and rolls it back at the end, which is the same idea wearing a transaction. When a boundary you depend on ships a sandbox, reach for it before you reach for injection. You get isolation and concurrency for free, and the production code carries no trace of the test setup.

## Inject what you cannot sandbox

That leaves the dependencies with no sandbox to fall back on. `MyApp.Inventory` has one: the clock. Nothing hands you a per-test namespace for time, so when a test needs to assert on a timestamp, it has to control where the time comes from. That is what injection is for.

Start with a behavior:

```elixir
defmodule MyApp.Clock do
  @callback utc_now() :: DateTime.t()

  def utc_now, do: DateTime.utc_now()
end
```

Production gets the real clock. A test passes a fixed one:

```elixir
defmodule MyApp.FixedClock do
  @behaviour MyApp.Clock

  @impl true
  def utc_now, do: ~U[2024-01-01 00:00:00Z]
end
```

The clock arrives through the same opts as the name, the test passes `clock: MyApp.FixedClock`, production lets the default stand, and the code calls `clock.utc_now()` without knowing or caring which one it got.

A fixed module is enough here because the clock only ever needs to return a constant. When an injected dependency has to return something different from one test to the next, reach for Mox, which gives you that per-test control through the same ownership model the sandboxes use. The clock does not need it, so it does not get it.

The warning runs both directions. If a process has nothing that needs substituting, do not invent something. A pure coordination server that holds state and delegates to already isolated functions does not need an injected clock or any other seam added for its own sake. Inject when a dependency has no sandbox and a test genuinely needs to control it. Sandbox when the library offers one. Leave it alone when neither is true.

## What you inject needs a contract

The two things `MyApp.Inventory` injects, its name and its clock, arrive as options, and options need a contract. The failure mode without one is quiet. The server accepts a keyword list, reads options wherever they happen to be needed, and lets missing keys become defaults.

Wrong:

```elixir
defmodule MyApp.Inventory.Server do
  use GenServer

  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  def init(opts) do
    {:ok,
     %{
       threshold: Keyword.get(opts, :threshhold, 100),
       clock: Keyword.get(opts, :clock, MyApp.Clock)
     }}
  end
end
```

You might notice the typo in `:threshhold`. The compiler will not. The server starts. The bad option silently falls through to the default, and now you have a production bug hiding behind a "helpful" fallback.

The fix is to define the contract once and fail at the process boundary.

```elixir
defmodule MyApp.Inventory.Server do
  use GenServer, restart: :transient

  alias MyApp.Inventory.Impl

  @reconcile_interval_ms :timer.minutes(5)

  @opts_schema NimbleOptions.new!(
                 name: [
                   type: :any,
                   required: true,
                   doc: "Registered name. An atom or a :via tuple."
                 ],
                 warehouse_id: [type: :string, required: true],
                 clock: [
                   type: :atom,
                   default: MyApp.Clock,
                   doc: "Time source implementing MyApp.Clock."
                 ]
               )

  def start_link(opts) when is_map(opts) do
    opts =
      opts
      |> Keyword.new()
      |> NimbleOptions.validate!(@opts_schema)
      |> Map.new()

    GenServer.start_link(__MODULE__, opts, name: opts.name)
  end

  def child_spec(opts) do
    %{
      id: {__MODULE__, Map.fetch!(opts, :warehouse_id)},
      start: {__MODULE__, :start_link, [opts]},
      restart: :transient
    }
  end

  def reserve(server, sku, qty),
    do: GenServer.call(server, {:reserve, sku, qty})

  def on_hand(server, sku),
    do: GenServer.call(server, {:on_hand, sku})

  @impl true
  def init(opts), do: {:ok, Impl.initial_state(opts), {:continue, :schedule}}

  @impl true
  def handle_continue(:schedule, state) do
    Process.send_after(self(), :reconcile, @reconcile_interval_ms)
    {:noreply, state}
  end

  @impl true
  def handle_call({:reserve, sku, qty}, _from, state) do
    case Impl.reserve(state, sku, qty) do
      {:ok, new_state} -> {:reply, :ok, new_state}
      {:error, _reason} = error -> {:reply, error, state}
    end
  end

  @impl true
  def handle_call({:on_hand, sku}, _from, state),
    do: {:reply, Impl.on_hand(state, sku), state}

  @impl true
  def handle_info(:reconcile, state) do
    Process.send_after(self(), :reconcile, @reconcile_interval_ms)
    {:noreply, Impl.reconcile(state)}
  end

  @impl true
  def handle_info(_message, state), do: {:noreply, state}
end
```

I prefer maps for these options because they remain useful after validation. `NimbleOptions` wants a keyword list, so we pay the conversion cost once in `start_link/1`, then convert back to a map. After that, callbacks and implementation functions can pattern match the options and use dot access. The server starts with a known shape or it does not start at all.

This is desirable because bad configuration fails before the process registers its name, starts timers, or accepts traffic. Tests get a clean setup failure instead of some mystery behavior later in the assertion phase.

## The server is wiring

Once the server has a name and a validated contract, the next question is where the logic should live. The answer is almost never "inside callbacks because that is where the message arrived."

The GenServer should own process mechanics. It should receive calls, reply to callers, schedule timers, and decide whether to keep or replace state. The business rules can live in ordinary functions.

```elixir
defmodule MyApp.Inventory.Impl do
  @moduledoc false

  alias MyApp.Inventory.{Cache, Supplier}

  @spec initial_state(map()) :: map()
  def initial_state(%{} = opts) do
    opts
    |> Map.put(:reserved, %{})
    |> Map.put(:last_reconciled_at, nil)
  end

  @spec on_hand(map(), String.t()) :: integer()
  def on_hand(%{reserved: reserved}, sku) do
    {:ok, stocked} = Cache.get(sku)
    (stocked || 0) - Map.get(reserved, sku, 0)
  end

  @spec reserve(map(), String.t(), pos_integer()) ::
          {:ok, map()} | {:error, :insufficient_stock}
  def reserve(state, sku, qty) do
    if on_hand(state, sku) >= qty do
      {:ok, update_in(state.reserved[sku], &((&1 || 0) + qty))}
    else
      {:error, :insufficient_stock}
    end
  end

  @spec reconcile(map()) :: map()
  def reconcile(%{clock: clock, warehouse_id: warehouse_id} = state) do
    case Supplier.fetch_levels(warehouse_id) do
      {:ok, levels} ->
        Enum.each(levels, fn {sku, qty} -> Cache.put(sku, qty) end)
        %{state | last_reconciled_at: clock.utc_now()}

      {:error, _reason} ->
        state
    end
  end
end
```

This split is where a lot of the testing value comes from. `Impl` runs in the test process. It does not start timers, receive messages, or need a process name. It is plain functions over a state map that happen to call the cache and the supplier along the way. Because they run in the test process, the sandboxes for those two resolve to the test that set them up, so the inventory math, reservation behavior, and reconciliation can all be exercised with ordinary synchronous tests.

The GenServer still gets tested, but those tests can stay focused on process behavior. Does the server start? Does it reply? Does it preserve state across calls? Does it schedule the work it owns? The callback module no longer has to be the only place where the domain can be exercised.

## What the tests look like

By my count, this design produces two kinds of tests: synchronous tests for the implementation module, and a smaller number of process tests for the GenServer itself.

The implementation tests can stay simple:

```elixir
defmodule MyApp.Inventory.ImplTest do
  use ExUnit.Case, async: true
  use MyApp.CacheCase

  setup {Req.Test, :set_req_test_from_context}

  alias MyApp.Inventory.{Cache, Impl}

  defp build_state(overrides \\ %{}) do
    Map.merge(
      %{
        warehouse_id: "wh-1",
        clock: MyApp.FixedClock,
        reserved: %{},
        last_reconciled_at: nil
      },
      overrides
    )
  end

  test "reconcile writes supplier levels into the sandboxed cache" do
    Req.Test.stub(MyApp.Inventory.Supplier, fn conn ->
      Req.Test.json(conn, %{"sku-1" => 12})
    end)

    state = build_state()

    assert %{last_reconciled_at: %DateTime{}} = Impl.reconcile(state)
    assert Impl.on_hand(state, "sku-1") == 12
  end

  test "reserve refuses to oversell" do
    Cache.put("sku-1", 3)

    assert {:error, :insufficient_stock} =
             Impl.reserve(build_state(), "sku-1", 5)
  end
end
```

Because `Impl.reconcile/1` runs in the test process, the `Req.Test` stub and the cache namespace both resolve to the test that set them up. There is no global mode to coordinate and no GenServer to stand up just to prove that a supplier response lands in the cache.

The server tests prove the process boundary:

```elixir
defmodule MyApp.Inventory.ServerTest do
  use ExUnit.Case, async: true
  use MyApp.CacheCase

  alias MyApp.Inventory.Server

  setup do
    name = :"inventory_#{System.unique_integer([:positive])}"

    start_supervised!(
      {Server,
       %{
         name: name,
         warehouse_id: "wh-1",
         clock: MyApp.FixedClock
       }}
    )

    {:ok, server: name}
  end

  test "answers on-hand stock through the server", %{server: server} do
    MyApp.Inventory.Cache.put("sku-1", 10)

    assert Server.on_hand(server, "sku-1") == 10
  end

  test "reserves available stock through the server", %{server: server} do
    MyApp.Inventory.Cache.put("sku-1", 10)

    assert :ok = Server.reserve(server, "sku-1", 3)
    assert Server.on_hand(server, "sku-1") == 7
  end
end
```

The sandbox setup lives in two boring places. The test helper starts the cache sandbox registry.

```elixir
ExUnit.start()

{:ok, _pid} = Cache.SandboxRegistry.start_link()
```

`Req.Test` needs nothing here, since its ownership server comes up with Req and the per-test mode is set by a setup callback. A small case template registers an isolated cache namespace for every test that uses it.

```elixir
defmodule MyApp.CacheCase do
  use Cache.CaseTemplate, default_caches: [MyApp.Inventory.Cache]
end
```

From there a test opts in with `use MyApp.CacheCase` and `setup {Req.Test, :set_req_test_from_context}`, and each test owns its own cache namespace and its own HTTP stubs. Skip either and the tests fall back to shared state, which quietly undoes the isolation you just designed for.

The server test is worth a second look. The cache write happens in the test process, but the read happens inside the server process, which is a different process entirely. It still resolves to the same namespace because `start_supervised!` starts the server inside the test's own supervision tree, so the lookup walks `$ancestors` back to the test that registered it. Start that same server from the application supervisor instead and the lookup would miss the sandbox completely. That is one more reason the process under test should belong to the test, not to the application.

This is the point where the payoff becomes obvious. The implementation tests run synchronously in the test process. The server tests start a per-test process under a unique name. The cache is sandboxed, the supplier is sandboxed, and the clock is a fixed module passed in. Nothing reaches into application config, nothing cleans up a named ETS table, and nothing forces these tests to run one at a time.

## When to stop

It is easy to take the wrong lesson here. The goal is not to make every GenServer look like a framework. The goal is to remove the shared state that makes tests fight.

Every GenServer should accept a configurable name and validate the options it is handed. After that, go dependency by dependency and ask one question: does this boundary have a sandbox? If it does, use it and leave the call site alone. Req, Ecto, and `elixir_cache` cover most of what a process talks to. If it does not, and a test needs to control it, inject it. If neither is true, do nothing. A pure coordination process needs no seams added for their own sake.

The design pressure here is the same one we face everywhere else in production systems. Code is read more than it is written, and most of the cost of our code shows up after the first version ships. Tests are part of that maintenance surface. If the system is hard to isolate, the tests become hard to trust. If the tests become hard to trust, the team stops running them, or runs them serialized, or keeps a mental list of "that one test that flakes."

That is not where you want to be.

Sandbox what you can. Inject what you cannot. Give every test its own name, its own namespace, and its own copy of anything it mutates. Then ExUnit can do the thing it is good at, which is running a lot of small, isolated checks all at once.

## Encode it where the work happens

Knowing the pattern is one thing. Getting it applied to every GenServer somebody adds six months from now is the harder problem. A convention that lives only in your head gets followed right up until the day it doesn't.

So write it down, and not as a wiki page nobody opens. An architecture decision record travels with the codebase and pins the convention in one place: accept a name, validate the options, sandbox the boundaries that offer one, and inject the ones that do not.

What makes that matter more than it used to is who is writing the code. A growing share of the GenServers in a codebase are now drafted and reviewed by coding agents, and an agent reaches for the most common shape in its training data, which is a process registered under its own module name with an HTTP client wired straight into `init/1`. Hand that same agent the record and it writes the isolated version instead. Feed the record into your implementation and review pipeline and every agent that touches a GenServer is held to the same bar, without anyone having to remember to ask for it.

[We keep ours here](https://github.com/BobbieBarker/adrs). The agents read from it on every implementation and every review, which is how a convention stops being folklore and turns into something the pipeline enforces.
