---
title: 'Safer Error Systems in Elixir'
date: '2024-03-04'
excerpt: 'Errors in Elixir often get treated as second class citizens which can make our systems harder to debug than they need to be. In this post we discuss building a more intuitive and robust error system for an easier time debugging and troubleshooting down the road.'
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

This article was written by Chad King and Mika Kalathil. Chad is a Senior Engineer at Pepsi, who was among the pioneering group which embraced the Learn Elixir program. His expertise in the field is a result of extensive experience garnered at various medium to large-scale companies. This journey has equipped him with a comprehensive understanding of the intricacies in software development, allowing him to insightfully identify its successes and areas for improvement. His unique perspective is a valuable asset in the ever-evolving world of technology.

Have you ever been deep in the trenches of Elixir development and suddenly faced an error as daunting as a brick wall? You’re not alone. Elixir, a language with immense power, presents unique challenges in error handling, often lacking a standard or defined way to represent errors.

## The Elixir Error Dilemma

In our journey of building Elixir applications, we regularly handle errors from our compiler, but runtime errors are often an afterthought, becoming non-informative, low quality or worst of all, ignored like the ‘Terms and Conditions’ on a sign-up form.

As Elixir developers, we often hear “Let it crash” and mistakenly assume that errors can be overlooked, allowing crashes to simply restart processes. This perspective is misleading and gracefully handling errors - be it through logging, returning an error code or running a recovery function - not only enhances our system’s uptime but also improves debuggability. Instead of allowing uncontrolled crashes, we should log the error, return it to our end user for appropriate handling or take some sort of recovery action, leaving only unexpected errors to crash the system so we can later investigate and turn them into expected errors.

## Missteps in Error Handling

Let’s explore a common anti-pattern. We encounter an error and decide to represent it as a string:

```elixir
def api_request do
  {:error, "Alert: A wild error appears! That API doesn't exist??"}
end
```

This message might seem useful and informative to us. Yet, for our software, this string is difficult and fragile to manage. We only have two options:

#### _Direct String Matching_:

```elixir
def some_call do
  case api_request() do
    {:ok, value} -> {:ok, value}
    {:error, "Alert: A wild error appears! That API doesn't exist??"} ->
      execute_some_backup_function()
  end
end
```

#### _Regex Matching_:

```elixir
def some_call do
  case api_request() do
    {:ok, value} -> {:ok, value}
    {:error, value} ->
      cond do
        value =~ "API doesn't exist" -> execute_some_backup_function()
        value =~ "user not found" -> execute_some_other_backup_function()
      end
  end
end
```

Whether using exact string matching or regex, a small change by an unaware developer could trigger a cascade of unexpected side effects. This highlights an important lesson: string errors, while great for user readability, are fragile and unreliable for predictable error handling.

## An Atom of Hope

Atoms simplify pattern matching, making our code readable and narrative-like, enabling easy control flow, many standard library functions in Elixir & Erlang already do this such as `File`:

```elixir
def bar(directory) do
  case File.ls(directory) do
    :eexist -> "Directory wasn't found"
    :eacces -> "Are you sure you have access?"
    _ -> "Game over, man."
  end
end
```

While useful in code, atoms come at the expense of human readability and lack a centralized location for listing and converting every expected error into a user-friendly format. Additionally, they don’t offer a place to include useful debugging information.

## Merging the Best of Both Worlds

What if we could combine the clarity of strings with the simplicity of atoms? Consider this approach:

```elixir
def api_request do
  {:error, %{
    code: :not_found,
    message: "User not found. Maybe a game of hide-and-seek?",
    details: %{user_id: 1234}
  }}
end
```

Now we have clear, human-readable messages, while also keeping an atom for declarative control flows, and a pre-defined spot for placing extra debugging information.
We can then pattern match in a straightforward manner:

```elixir
with {:error, %{code: :not_found, message: message}} <- api_request() do
  Logger.warn(message)
  recovery_function()
end
```

Now a developer can’t accidentally make a well-intended change that breaks our code, and we can log a human-readable error message for future investigation.

## Elevating with ErrorMessage

Why settle for mere improvement when we can revolutionize? Utilizing generic maps for errors can be chaotic and inconsistent. With [ErrorMessage](https://github.com/mikaak/elixir_error_message), we can set a new standard for error representation in our systems.

Returning errors becomes as simple as a function call:

```elixir
def api_request do
  {:error, ErrorMessage.not_found(
    "No user found. Just echoes and tumbleweeds.",
    %{user_id: 1234} # We can omit this parameter if no details needed
  )}
end
```

Which returns a struct like so:

```elixir
%ErrorMessage{
  code: :not_found,
  message: "No user found. Just echoes and tumbleweeds.",
  details: %{user_id: 1234}
}
```

This approach ensures uniformity and readability, turning our errors into manageable and insightful tools. With `ErrorMessage`, we can effortlessly match errors and utilize the detailed information provided to simplify debugging for the end user. Moreover, we can leverage this information both in our Phoenix APIs and in our logs:

```elixir
def show(conn, %{"user_id" => user_id}) do
  case Accounts.find_user(%{id: user_id}) do
    {:ok, user} -> json(conn, Map.from_struct(user))
    {:error, %ErrorMessage{code: code} = e} ->
      Logger.error(to_string(e))
      conn |> put_status(code) |> json(ErrorMessage.to_jsonable_map(e))
  end
end
```

`ErrorMessage` is battle tested and has been in use at [Blitz](https://blitz.gg) for over 4 years. It’s also been utilized in multiple other companies like [Requis](https://requis.com/) and [CheddarFlow](https://www.cheddarflow.com/) to help make error systems more predictable and give the users a great experience. Our goal is always to convert unexpected errors into expected errors by wrapping them in `ErrorMessage` and giving us a fighting chance against the entropy that happens over time in large systems.

We can see it in use already in some other packages such as [EctoShorts](https://github.com/mikaak/ecto_shorts) and [ElixirCache](https://github.com/mikaak/elixir_cache) which treat errors as first-class citizens. The more errors and fail states the system can be expected to handle, the more resilient it should become.

## Wrapping Up

In Elixir, errors are not stumbling blocks; they are opportunities to showcase our problem-solving skills. Treating errors as first-class citizens, thinking about, and utilizing our skills to resolve them and building our libraries to be able to support others doing so as well, is crucial. In some languages, like Go, this approach is ingrained in the language itself, forcing developers to consciously address and manage exceptions.

Armed with the right strategies and tools, we can use these techniques to masterfully navigate Elixir errors. Even the most challenging bugs become traceable and replicable with ease. By elevating our approach to error handling, we turn potential pitfalls into valuable insights, reinforcing the robustness and reliability of our Elixir applications.

Errors in Elixir, therefore, should not be feared or ignored. Instead, they should be actively accounted for as a normal part of our development process, guiding us toward creating more resilient and user-friendly applications. With a thoughtful and systematic approach to error handling, we transform our code bases into being predictable and easy to work with.
