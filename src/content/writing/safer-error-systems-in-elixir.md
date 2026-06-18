---
title: 'Safer Error Systems in Elixir'
date: '2024-03-04'
excerpt: 'Errors in Elixir deserve stable codes, readable messages, and useful details so systems can recover predictably without hiding failures.'
tags: ['elixir', 'error-handling', 'architecture']
draft: false
readingTime: '7 min'
authors: ['Chad King', 'Mika Kalathil']
originalPublication:
  site: 'Learn Elixir'
  url: 'https://learn-elixir.dev/blogs/safer-error-systems-in-elixir'
  date: '2024-03-04'
  authors: ['Chad King', 'Mika Kalathil']
---

Have you ever been deep in the trenches of Elixir development and suddenly faced an error as daunting as a brick wall?

Elixir is powerful, but error handling can still be awkward. There is not always a standard way to represent expected failures, and that leaves teams inventing local conventions as the system grows.

## The Elixir error dilemma

In Elixir applications, compiler errors get plenty of attention. Runtime errors are easier to neglect. They become non-informative, low-quality, or ignored like the terms and conditions on a signup form.

As Elixir developers, we often hear "let it crash" and accidentally turn that into "do not think about errors." That is the wrong lesson. Gracefully handling expected errors, whether through logging, returning an error code, or running a recovery function, improves both uptime and debuggability.

Unexpected errors should still crash. That is how we notice them, investigate them, and turn them into expected errors later. But once a failure mode is known, the system should have a useful way to represent it.

## Missteps in error handling

Here is a common anti-pattern: representing errors as plain strings.

```elixir
def api_request do
  {:error, "Alert: A wild error appears! That API doesn't exist??"}
end
```

The message might look useful to a human, but it is fragile for software. Once an error is only a string, downstream code usually has two bad options.

#### Direct string matching

```elixir
def some_call do
  case api_request() do
    {:ok, value} ->
      {:ok, value}

    {:error, "Alert: A wild error appears! That API doesn't exist??"} ->
      execute_some_backup_function()
  end
end
```

#### Regex matching

```elixir
def some_call do
  case api_request() do
    {:ok, value} ->
      {:ok, value}

    {:error, value} ->
      cond do
        value =~ "API doesn't exist" ->
          execute_some_backup_function()

        value =~ "user not found" ->
          execute_some_other_backup_function()
      end
  end
end
```

Whether you use exact string matching or regex matching, a small copy change can trigger unexpected behavior. String errors are useful for readability, but unreliable as a control-flow contract.

## An atom of hope

Atoms are much better for pattern matching. They make control flow readable, stable, and explicit. Plenty of Elixir and Erlang APIs already use this shape.

```elixir
def bar(directory) do
  case File.ls(directory) do
    {:ok, files} ->
      files

    {:error, :enoent} ->
      "Directory wasn't found"

    {:error, :eacces} ->
      "Are you sure you have access?"

    {:error, _reason} ->
      "Game over, man."
  end
end
```

Atoms are great for code, but they are not enough by themselves. They are not very helpful to an end user, they do not give you a centralized place to translate expected errors into friendly messages, and they do not carry extra debugging context.

## Merging the best of both worlds

What if we combine the clarity of strings with the stability of atoms?

```elixir
def api_request do
  {:error,
   %{
     code: :not_found,
     message: "User not found. Maybe a game of hide-and-seek?",
     details: %{user_id: 1234}
   }}
end
```

Now we have a human-readable message, a stable atom for control flow, and a defined place for debugging information.

```elixir
def some_call do
  case api_request() do
    {:ok, value} ->
      {:ok, value}

    {:error, %{code: :not_found, message: message}} ->
      Logger.warning(message)
      recovery_function()
  end
end
```

Now a developer can update the message without accidentally breaking the behavior of the system. We can log something readable, branch on something stable, and keep the error useful for later investigation.

## Elevating with ErrorMessage

Generic maps are an improvement, but they can still drift. With [`ErrorMessage`](https://github.com/mikaak/elixir_error_message), we can make error representation consistent across a system.

Returning errors becomes a function call:

```elixir
def api_request do
  {:error,
   ErrorMessage.not_found(
     "No user found. Just echoes and tumbleweeds.",
     %{user_id: 1234}
   )}
end
```

Which returns a struct like this:

```elixir
%ErrorMessage{
  code: :not_found,
  message: "No user found. Just echoes and tumbleweeds.",
  details: %{user_id: 1234}
}
```

This gives us uniformity and readability. We can match on error codes, keep detailed context around for debugging, and serialize the same error shape through Phoenix APIs or logs.

```elixir
def show(conn, %{"user_id" => user_id}) do
  case Accounts.find_user(%{id: user_id}) do
    {:ok, user} ->
      json(conn, Map.from_struct(user))

    {:error, %ErrorMessage{code: code} = error} ->
      Logger.error(to_string(error))

      conn
      |> put_status(code)
      |> json(ErrorMessage.to_jsonable_map(error))
  end
end
```

`ErrorMessage` is battle-tested and has been in use at [Blitz](https://blitz.gg) for years. It has also been used at companies like [Requis](https://requis.com/) and [CheddarFlow](https://www.cheddarflow.com/) to make error systems more predictable and give users a better experience.

The goal is to convert unexpected errors into expected errors by wrapping them in `ErrorMessage`. That gives us a fighting chance against the entropy that appears over time in large systems.

We can see this approach in packages like [`EctoShorts`](https://github.com/mikaak/ecto_shorts) and [`ElixirCache`](https://github.com/mikaak/elixir_cache), which treat errors as first-class citizens. The more failure states a system can handle intentionally, the more resilient it becomes.

## Wrapping up

In Elixir, errors are not just stumbling blocks. They are opportunities to make the system easier to understand.

Treating errors as first-class citizens is crucial. We need to think about them, resolve them intentionally, and build libraries that help other developers do the same. In some languages, like Go, this habit is built into the shape of the language. In Elixir, we have to choose it.

With the right strategies and tools, difficult bugs become easier to trace and reproduce. By improving our approach to error handling, we turn potential pitfalls into useful signals and make our applications more robust.

Errors in Elixir should not be feared or ignored. They should be accounted for as a normal part of development, guiding us toward systems that are more predictable, more resilient, and easier to work with.
