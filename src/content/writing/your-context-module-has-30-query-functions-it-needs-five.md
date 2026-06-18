---
title: 'Your context module has 30 query functions. It needs five.'
date: '2026-02-23'
excerpt: 'The combinatorial explosion disappears because the combinations live in the data, not the code.'
tags: ['elixir', 'ecto', 'architecture']
draft: false
readingTime: '7 min'
authors: ['Chad King']
originalPublication:
  site: 'Medium'
  url: 'https://bobbie-barker.medium.com/your-context-module-has-30-query-functions-it-needs-five-94a826886b7d'
  date: '2026-02-23'
  authors: ['Chad King']
---

Every Elixir codebase that touches a database has a context module that looks like this:

```elixir
defmodule MyApp.Jobs do  
  alias MyApp.Repo  
  alias MyApp.Jobs.Job  
  
  import Ecto.Query  
    
  def find_job(id), do: Repo.get(Job, id)  
    
  def find_job_by_slug(slug) do  
    Repo.get_by(Job, slug: slug)  
  end  
    
  def all_jobs do  
    Repo.all(Job)  
  end  
    
  def all_active_jobs do  
    from(j in Job, where: j.status == :active)  
    |> Repo.all()  
  end  
    
  def all_jobs_by_company(company_id) do  
    from(j in Job, where: j.company_id == ^company_id)  
    |> Repo.all()  
  end  
    
  def all_active_jobs_by_company(company_id) do  
    from(j in Job,  
      where: j.company_id == ^company_id and j.status == :active    )  
    |> Repo.all()  
  end  
    
  def all_jobs_with_salary_above(min_salary) do  
    from(j in Job, where: j.salary >= ^min_salary)  
    |> Repo.all()  
  end  
    
  def all_remote_jobs do  
    from(j in Job, where: j.remote == true)  
    |> Repo.all()  
  end  
    
  def search_jobs_by_title(title) do  
    from(j in Job, where: ilike(j.title, ^"%#{title}%"))  
    |> Repo.all()  
  end  
    
  # ... and it keeps going  
end
```

If you’ve been writing Elixir for any amount of time, you’ve seen this. You may have written it yourself. I certainly have. The module starts clean with three or four functions, and then the feature requests start rolling in. The business needs to filter by status. Then by the company. Then by salary range. Then by location. Each new requirement gets a new function because each query is slightly different. Six months later, you’ve got a context module with 30 public functions, half of which exist to serve a single caller. The tests mirror this explosion with bespoke test cases for each function, most of which just assert that a WHERE clause works. The module has become a junk drawer of queries masquerading as a domain API.

The root problem is that we’re encoding query parameters into function names. `all_active_jobs_by_company/1` bakes two filters into the function signature. When someone needs an active job with a minimum salary, the combinatorial explosion begins. Do you write `all_active_jobs_by_company_with_min_salary/2`? Or do you reach for a more general approach?

## Data-Driven Queries with EctoShorts

[EctoShorts](https://hexdocs.pm/ecto_shorts) replaces this pattern with a single idea: let a map describe the query. Instead of encoding filters into function names, you pass them as data.

```elixir
defmodule MyApp.Jobs do  
  alias EctoShorts.Actions  
  alias MyApp.Jobs.Job  
  
  def all(params \\ %{}), do: Actions.all(Job, params)  
  def find(params), do: Actions.find(Job, params)  
  def create(params), do: Actions.create(Job, params)  
  def update(job, params), do: Actions.update(Job, job, params)  
  def delete(job), do: Actions.delete(Job, job)  
end
```

That’s the entire context module. Five functions that handle every CRUD operation and query combination the business will ever need. The callers describe what they want through the params map:

```elixir
# Find active jobs  
Jobs.all(%{status: :active})  
  
# Active jobs at a specific company  
Jobs.all(%{status: :active, company_id: 42})  
  
# Active remote jobs with salary >= 100k, newest first  
Jobs.all(%{  
  status: :active,  
  remote: true,  
  salary: %{gte: 100_000},  
  order_by: {:desc, :inserted_at}  
})  
  
# Search by title  
Jobs.all(%{title: %{ilike: "engineer"}})  
  
# Paginated results with preloads  
Jobs.all(%{  
  status: :active,  
  preload: [:company, :skills],  
  first: 25,  
  offset: 50  
})  
  
# Find a single job by compound criteria  
Jobs.find(%{slug: "senior-elixir-dev", status: :active})
```

What EctoShorts gives you is a declarative DSL for querying. You describe the result set you want, not the recipe for getting it. The params map says “active jobs, salary at least 100k, newest first,” and the library figures out the where clauses, comparisons, and ordering. Operators like `gte`, `lte`, `like`, and `ilike` work through nested maps on any schema field. Pagination, ordering, and preloads are built in. The entire translation layer lives in `EctoShorts.CommonFilters`, which converts your declaration into an Ecto query at runtime. You stop writing queries and start describing the data you need.

Let’s look at what this does to the test surface. The original module with 30 bespoke functions needed 30+ test cases, each constructing a query and asserting the results. The EctoShorts version needs tests for the business logic that calls these functions, but the filtering itself is tested by the library. You don’t need to prove that `where: j.status == :active` works. Ecto already proved that. What you need to test is that your checkout flow calls `Jobs.all(%{status: :active})` with the right params. The tests become about behavior, not plumbing.

## When You Need More: Query Composition

EctoShorts handles the common case, but production systems have queries that go beyond simple field filters. Joins, subqueries, aggregations. The answer isn’t to abandon EctoShorts and fall back to bespoke functions. The answer is to compose query fragments with EctoShorts filters.

The pattern is straightforward. Define composable query functions on your schema module that return `Ecto.Query.t()`. Pipe them into `Actions.all` or `Actions.find`, which applies the remaining filters from the params map.

```elixir
defmodule MyApp.Jobs.Job do  
  use Ecto.Schema  
  import Ecto.Query  
  
  schema "jobs" do  
    field :title, :string  
    field :slug, :string  
    field :status, Ecto.Enum, values: [:active, :closed, :draft]  
    field :salary, :integer  
    field :remote, :boolean  
    belongs_to :company, MyApp.Companies.Company  
    many_to_many :skills, MyApp.Skills.Skill,  
      join_through: "job_skills"  
    timestamps()  
  end  
  
  def from(query \\ __MODULE__) do  
    from(j in query, as: :jobs)  
  end  
  
  def filter_by_skill_ids(query \\ from(), skill_ids) do  
    query  
    |> join(:inner, [jobs: j], s in assoc(j, :skills), as: :skills)  
    |> where([skills: s], s.id in ^skill_ids)  
    |> distinct([jobs: j], j.id)  
  end  
  
  def filter_by_company_name(query \\ from(), company_name) do  
    query  
    |> join(:inner, [jobs: j], c in assoc(j, :company), as: :company)  
    |> where([company: c], ilike(c.name, ^"%#{company_name}%"))  
  end  
  
  def posted_within_days(query \\ from(), days) do  
    cutoff = Date.utc_today() |> Date.add(-days)  
    where(query, [jobs: j], j.inserted_at >= ^cutoff)  
  end  
end
```

Every query function follows the same contract: takes a query with a sensible default, returns an `Ecto.Query.t()`, composes via pipes. Named bindings (`as: :jobs`) make composition safe because fragments can reference bindings by name instead of position.

[](https://medium.com/write?source=promotion_paragraph---post_body_banner_home_for_stories_blocks--94a826886b7d---------------------------------------)

Now the context orchestrates these fragments alongside EctoShorts:

```elixir
defmodule MyApp.Jobs do  
  alias EctoShorts.Actions  
  alias MyApp.Jobs.Job  
  
  def all(params \\ %{}), do: Actions.all(Job, params)  
    
  def find(params), do: Actions.find(Job, params)  
    
  def all_by_skills(%{skill_ids: skill_ids} = params) do  
    skill_ids  
    |> Job.filter_by_skill_ids()    |> Actions.all(Map.delete(params, :skill_ids))  
  end  
    
  def all_by_company_name(%{company_name: name} = params) do  
    name  
    |> Job.filter_by_company_name()    |> Actions.all(Map.delete(params, :company_name))  
  end  
    
  def all_recent(%{days: days} = params) do  
    days  
    |> Job.posted_within_days()    |> Actions.all(Map.delete(params, :days))  
  end  
end
```

Notice the pattern. The context function consumes the custom params it needs for the query fragment, pipes the result into `Actions.all`, and drops those consumed params from the map before handing them to EctoShorts. This prevents EctoShorts from trying to filter on `:skill_ids` or `:days`, which aren't actual schema fields. The remaining params (status, salary range, pagination, preloads) get handled by CommonFilters as usual.

```elixir
# Find active Elixir jobs paying over 120k, posted in the last 30 days  
Jobs.all_recent(%{  
  days: 30,  
  status: :active,  
  salary: %{gte: 120_000},  
  preload: [:company]  
})
```

One function call. The join logic lives in the schema where it belongs. The field filters live in the params map where they belong. The context function is three lines of orchestration. Compare that to writing `all_active_recent_jobs_with_min_salary_and_preloads/3`.

## Caching Falls Out Naturally

Once your reads are parameterized maps, something interesting happens. Caching becomes almost trivial because the cache key is the params map itself. [SchemaCache](https://hexdocs.pm/schema_cache) exploits this directly.

```elixir
defmodule MyApp.Jobs do  
  alias EctoShorts.Actions  
  alias MyApp.Jobs.Job  
  
  @job_ttl :timer.minutes(15)  
  
  def all(params \\ %{}) do  
    SchemaCache.read("all_jobs", params, @job_ttl, fn ->  
      Actions.all(Job, params)  
    end)  
  end  
  
  def find(params) do  
    SchemaCache.read("jobs", params, @job_ttl, fn ->  
      Actions.find(Job, params)  
    end)  
  end  
  
  def create(params) do  
    SchemaCache.create(fn ->  
      Actions.create(Job, params)  
    end)  
  end  
  
  def update(job, params) do  
    SchemaCache.update(fn ->  
      Actions.update(Job, job, params)  
    end)  
  end  
end
```

`SchemaCache.read` takes a key prefix, the params map, a TTL, and a fallback function. On a cache miss, it calls the fallback, caches the result, and returns it. On a hit, it returns the cached value. The params map is deterministically serialized into the cache key, so `%{status: :active, salary: %{gte: 100_000}}` always produces the same key regardless of insertion order.

The real payoff is on mutations. When you wrap a create or update in `SchemaCache.create` or `SchemaCache.update`, SchemaCache inspects the returned schema struct and automatically evicts every cached entry that references it. If you update Job #42, every cached query result containing Job #42 gets invalidated. If you create a new job, every cached job collection gets invalidated. No manual cache key management. No "I forgot to invalidate the cache when adding a new write path." The cache follows the data.

This works because SchemaCache maintains a reverse index from schema instances to cache keys. When it caches a query result, it records which schemas appear in that result. When a schema mutates, it looks up every cache key referencing that schema and evicts them. The implementation details are in the [SchemaCache docs](https://hexdocs.pm/schema_cache), but the important thing is that you don’t have to think about invalidation. You wrap your reads and writes, and the library handles the rest.

## Putting It Together

The full pattern is three layers working together. EctoShorts converts parameter maps into queries, eliminating the need for bespoke query functions. Composable query fragments on schema modules handle joins and complex filtering that EctoShorts can’t express. SchemaCache wraps it all with automatic cache-aside and invalidation keyed off the same params maps.

Your context modules become thin orchestration layers. They don’t contain query, caching, or changeset logic. They connect the caller’s intent (expressed as a params map) to the right combination of query fragments and CRUD operations. When a new feature requires a new filter combination, you don’t add a function. You pass a different map. When it requires a new join, you add one composable function to the schema and one thin wrapper to the context. The combinatorial explosion disappears because the combinations live in the data, not the code.

This is what it looks like to design systems that are easy to change. Not because you predicted every future requirement, but because you made the common case free and the uncommon case cheap.