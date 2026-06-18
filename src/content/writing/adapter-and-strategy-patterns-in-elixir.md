---
title: 'Adapter and Strategy Patterns in Elixir'
date: '2024-09-01'
excerpt: 'One of the challenges we all face when designing our systems is building them to change.'
tags: ['elixir', 'design-patterns', 'architecture']
draft: false
readingTime: '14 min'
authors: ['Chad King']
originalPublication:
  site: 'Medium'
  url: 'https://bobbie-barker.medium.com/adapter-and-strategy-patterns-in-elixir-e0af78889803'
  date: '2024-09-01'
  authors: ['Chad King']
---

One of the challenges we all face when designing our systems is building them to change. The code you write will spend most of its life in the maintenance phase, but that doesn’t mean it won’t ever have to be worked on. Bugs will inevitably be discovered, and new features requested. Some parts of our systems will prove themselves to be relatively cold, that is not needing many additional man hours to continue to serve the business. Authentication systems for example are very well understood and once built rarely require any additional man hours to continue functioning. Other parts of our platforms will be hot, that is requiring many additional man hours to serve the needs of the business. Because code is read more than it is written it is crucial that we try to write code that is easy to understand so it remains easy to maintain. By writing code that is easy to maintain we make it easier to affect change on our code bases, hopefully enabling the team to achieve its goal of rapidly shipping code to production. One of the ways we can achieve this goal is by implementing design patterns. When used on well suited problems design patterns enable you to write easy to understand solutions to complex problems leaving your code loosely coupled and your concerns neatly separated. This article will examine applications of the strategy and adapter patterns. Simply put the strategy pattern is a way to choose behavior at runtime, while the adapter pattern is a way to use unrelated interfaces by providing a common interface. Let’s start out with a naive code example:

```elixir
defmodule FooApp.Emails do  
  import Swoosh.Email  
  
  def send_welcome_email(user) do  
    new()  
    |> to({user.name, user.email})    |> from({"Dr B Banner", "hulk.smash@example.com"})  
    |> subject("Hello, Avengers!")    |> html_body("<h1>Hello #{user.name}</h1>")  
    |> text_body("Hello #{user.name}\n")    |> Mailer.deliver  
    |> case do  
      {:error, {code, error}} ->  
        Logger.error("failed to send email. code: #{code}, #{inspect(error)}")  
      {:error, error} ->  
        Logger.error("failed to send email. #{inspect(error)}")  
      {:ok, _} ->  
        :ok  
    end  
  end  
  
  def send_warning_email(params) do  
    new()    |> to({user.name, user.email})  
    |> from({"Dr B Banner", "hulk.smash@example.com"})    |> subject("Watchout, Avengers! #{params.villian.name} is attacking")  
    |> html_body("<h1>Watchout #{params.user.name}</h1>")    |> text_body("Watchout #{params.user.name}\n")  
    |> Mailer.deliver    |> case do  
      {:error, {code, error}} ->  
        Logger.error("failed to send email. code: #{code}, error: #{inspect(error)}")  
      {:error, error} ->  
        Logger.error("failed to send email. error: #{inspect(error)}")  
      {:ok, _} ->  
        :ok  
    end  
  end  
end
```

You might notice the last nine lines of both functions are the same. They are the same because we don’t separate the concern of arranging the data into a `Swoosh.Email` struct from the concern of sending the email itself. This also causes the tests for these functions to be more complicated than they need to be because they must accommodate more behavior. If we were able to test the arrangement of the data separately from the sending of the data, then the tests for each concern would become simpler and we would only have to test the sending of the data once because it is identical each time. Which brings me to the second major problem with this module. Every time we want to be able to send a new kind of email from the system we must add a new public function. That doesn’t look very bad right now, but what if our system could send dozens of different kinds of emails? This module and corresponding test module would quickly get noisy and maybe more difficult to maintain. Let’s apply the strategy pattern and see what kind of effect it has on the quality of our email system as well as the way we would add new emails going forward.

```elixir
defmodule FooApp.Emails do  
  @type email :: Swoosh.Email  
  @callback build(struct()) :: email  
  
  def send(%email_module{} = params) do  
    params  
    |> email_module.build()    |> Mailer.deliver  
    |> case do  
    {:error, {code, error}} ->  
      Logger.error("failed to send email. code: #{code}, error: #{inspect(error)}")  
    {:error, error} ->  
      Logger.error("failed to send email. error: #{inspect(error)}")  
    {:ok, _} ->  
      :ok  
    end  
  end  
end  
  
defmodule FooApp.Emails.WelcomeEmail do  
  @enforce_keys [:name, :email]  
  defstruct @enforce_keys  
  @behavior FooApp.Emails  
  
  build(%__MODULE__{name: name, email: email}) do  
    new()    |> to({name, email})  
    |> from({"Dr B Banner", "hulk.smash@example.com"})    |> subject("Hello, Avengers!")  
    |> html_body("<h1>Hello #{name}</h1>")    |> text_body("Hello #{name}\n")  
  end  
end  
  
defmodule FooApp.Emails.WarningEmail do  
  @enforce_keys [:name, :email, :villian_name]  
  defstruct @enforce_keys  
  @behavior FooApp.Emails  
  
  build(%__MODULE__{name: name, email: email, villian_name: villian_name}) do  
    new()  
    |> to({name, email})    |> from({"Dr B Banner", "hulk.smash@example.com"})  
    |> subject("Watchout, Avengers! #{villian_name} is attacking")    |> html_body("<h1>Watchout #{villian_name}</h1>")  
    |> text_body("Watchout #{villian_name}\n")  
  end  
end
```

In our new design we have replaced the old API of the `FooApp.Emails` module with a new and singular `send/1` function. `send/1` can send any type of email implemented in the system and going forward unless the requirements for sending an email change, the `FooApp.Emails` module won’t change again either. We can also reason about how `FooApp.Emails` should be tested now too. By my count `FooApp.EmailsTest` is going to need three tests. One for the happy path using `assert_email_sent/1` to verify the code is integrating properly with our email client. And then two additional tests for our error paths. At this point it’s probably worth mentioning that these would be easier to test if our email client was behind a mock so we could control the response and ensure our tests for the error cases can reach those code paths on command. Our test might look something like this.

```elixir
test "handles error from swoosh" do  
  welcome_email = %WelcomeEmail{name: "foo", email: "foo@email.com"}  
  expect(FooApp.MockEmail, :deliver, fn welcome_email -> {:error, :big_problems} end)  
  log_msg = "failed to send email. error: big_problems"  
    
  capture_log(fn ->  
    assert :ok = FooApp.Email.send(welcome_email)  
  end) =~ log_msg  
  
  refute_email_sent(subject: "Hello, Avengers!")  
end
```

Because of the nature of testing a function that can send emails we have quite a bit to account for each time we want to test the `send/1` function. Let’s contrast that against what it might look like to test our `FooApp.Emails.WelcomeEmail` module. Because it is a pure function with no side effects, I think we can get away with writing one simple test for the `build/1` function.

```elixir
test "builds a swoosh email" do  
  assert %Swoosh.Email{  
    to: {"foo", "email@email.com"}  
    subject: "Hello, Avengers!"  
  } = FooApp.Emails.WelcomeEmail.build(  
    %WelcomeEmail{name: "foo", email: "email@email.com"}  
    )  
end
```

That’s it. Now each time we want to add a new type of email to the system we create a new email module and implement the `build/1` function. Then our test module just asserts the correct `Swoosh.Email` struct was built by the `build/1` function. Let’s contrast that to our original implementation. Our original implementation didn’t separate any of our concerns and utilized a bespoke API to add new emails into the system. Each time we added a new email we would have had to add three tests of the same size and complexity as our ”handles error from swoosh” test case. The legacy design would have required 6 tests where the new system requires 4. If we had 10 different kinds of emails the old system would have 30 tests, and the new one would only have 13. That’s a lot of lines of code no one is ever going to have to look at or maintain. Due to the way the email modules are written with a struct and behavior you might even be able to argue that there isn’t really any value to testing these modules anymore as any mistake in implementation is almost certain to cause a compilation error. In that case our design would require only the three tests to verify the code paths in the `send/1` function. That’s quite the improvement in design due to our implementation of the strategy pattern.

### Adapter Pattern

The adapter pattern is radically simple but can have a deep impact on the quality of a code base when employed correctly. Sometimes referred to as a wrapper, the purpose of the pattern is to allow incompatible interfaces to collaborate. Adapter patterns are also the cornerstone of an architecture referred to as Ports and Adapters.

> The idea behind the Ports and Adapters architecture is that ports make up the boundaries of an application. A port is something that interacts with the outside world: user interfaces, message queues, databases, files, command-line prompts, etcetera. While the ports constitute the interface to the rest of the world, adapters translate between the ports and the application model. — [Mark Seemann](https://blog.ploeh.dk/2016/03/18/functional-architecture-is-ports-and-adapters)

You might have already noticed that adapters are used in many popular elixir libraries. Swoosh, Tesla, Ecto, Nebulex, and ElixirCache all make use of the adapter pattern. Whether they are sending email, http requests, talking to a database, or k/v datastore all the domains handled by these libraries fit the definition of a port and the adapters they provide bridge the gap between our application and that outside world we need to communicate with. This is desirable because Adapters serve as a buffer between the port and our application, insulating our business logic from changes that might come as side effects of needing access to these ports for our applications. Imagine if you came into work tomorrow and found an urgent request from the business to swap email providers because the current one has erroneously identified your activity as spamming. Thanks to the adapter pattern implemented in Swoosh only a few lines of config changes are necessary to change your email provider. The ability to swap adapters without churning code elsewhere in the application essentially makes the move risk free. Let’s take a closer look at how swoosh implements the adapter pattern. As you probably know swoosh sets the adapter module as a part of the config like so:

```elixir
# In your config/config.exs file  
config :sample, Sample.Mailer,  
adapter: Swoosh.Adapters.Gmail,  
access_token: {:system, "GMAIL_API_ACCESS_TOKEN"}
```

Then when an email is sent via `Mailer.deliver/2` our email delivery journey starts here in this function:

```elixir
def deliver(email, config) do  
  metadata = %{email: email, config: config}  
  
  instrument(:deliver, metadata, fn ->  
   Mailer.deliver(email, parse_config(config)  
  end)  
end
```

It’s worth pausing to look at this as this module. What we see here is another common responsibility of adapter pattern modules. Since adapters sit on the boundary between our application model and the outside world, it is very common to see telemetry added to this layer as well as serialization and deserialization between internal and external data models. From the `deliver/2` function defined in the macro, we advance to the `deliver/2` defined in the `Swoosh.Mailer` module:

```elixir
def deliver(%Swoosh.Email{} = email, config) do  
  adapter = Keyword.fetch!(config, :adapter)  
  :ok = adapter.validate_config(config)  
  adapter.deliver(email, config)  
end
```

It’s here where we can see the adapter being pulled from the config and the `deliver/2` function from our adapter module being invoked. The actual logic of sending an email via Gmail is implemented in the `Swoosh.Adapters.Gmail` module itself. Adapter modules must implement a common interface and uphold the API contract defined by those interfaces. Which is why the `Gmail` module uses `Swoosh.Adapter` to bring in the adapter behavior where the `deliver/2` callback is defined. As you can see the adapter pattern itself is very simple, and then whatever the domain is that is being encapsulated by the adapter can be as complex as it must be to get the job done.

### Strategy && Adapter together in harmony

Finally, we will examine how the Strategy and Adapter patterns can be used together to add a common feature to our application model, payment processing. Payment processing is a complicated domain with significant risk to the business if not designed and implemented correctly. Processing payments requires integration with the financial system thus adding payment processing to an application means integrating with a payment processor. It is understood in ecommerce circles that the more ways you can accept payment from your customers the more likely you are to make a sale, so it’s also not uncommon to integrate with more than one processor. Essentially, you want to be where your customers’ money is. For our purposes we’ll assume that we’re integrating with Braintree and Stripe.

Each payment processor comes with its own data models to represent customers, transactions, subscriptions, and payment methods among other things. If we don’t serialize these external models from each of our payment processors into a single internal model, then each processor we integrate with will expand the [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) of our application model as our application will have to be capable of understanding more and more data models. Each payment processor also comes with its own logic on how a subscription or payment should be processed. If we want to maintain a clean architecture with good separation of concerns, we should identify these processors as ports and place them on the periphery of our application and encapsulate the implementation details of integrating directly with each payment processor behind an adapter that exposes a common interface for the rest of the application to use to complete tasks related to facilitating payments.

Before we begin by examining the common public interface our application will be using to process transactions, I should probably offer a disclaimer that these code examples are not literal instructions on how to integrate with these payment processors. Rather they are illustrative examples designed to allow us to appreciate how these design patterns might impact the way our system integrates with payment processors. Because of the complex nature of the businesses we support, and the complex services that these payment processors offer, the integration efforts for any application can look wildly different from each other.

This example aims to model a simple ecommerce shopping experience where customers browse available products, add them to their shopping cart, and when ready they purchase the items in their cart by checking out. Let’s begin by examining the top level of our API `ShoppingCart.checkout/3`. In this example we are assuming that the user’s preference for payment providers has been supplied as an argument, perhaps as a part of the graphQL mutation that initiated the transaction on the server, or perhaps some other steps that were run before this figured out which payment provider to use. Regardless, we’re able to use that signal and plug it into `ProviderTypeConverter.to_adapter/1` to retrieve the correct adapter module for our payment provider of choice. At first glance, `checkout/3` doesn’t seem to be doing a lot, it’s mostly just code glue connecting the different APIs that allow us to complete a customer transaction. You can kind of look at the checkout happening in three phases. First a preparation phase where we gather the requisite information necessary to perform the transaction. Next is the execution phase where the application interops with the 3rd party payment processor to complete the transaction. Finally, a post-transaction phase where the application can address any follow up steps after a transaction fails or succeeds. It is this ability to read the implementation of a customer checkout briefly that informs us of the success of our design. Remember from the start of the article, that our goal is to create readable and maintainable systems.

```elixir
defmodule FooApp.ShoppingCart do  
  alias FooApp.{  
    Customer,  
    PaymentsApi,  
    ProviderTypeConverter,  
    Invoices,  
    User,  
    ShoppingCart  
  }  
  
  alias PaymentApi.Tranasction  
  
  @spec checkout(User.t(), ShoppingCart.t(), atom()) :: ErrorMessage.t_res(Transaction.t())  
  def checkout(user, %ShoppingCart{} = cart, provider_type) do  
    user = FooAppPG.Repo.Users.preload(user, :payment_providers)  
    adapter = ProviderTypeConverter.to_adapter(provider_type)  
  
    with {:ok, provider} <- Customer.find_provider_by_type(user.payment_providers, provider_type),  
      {:ok, transaction} <- PaymentsApi.execute_transaction(adapter, cart, provider),  
      {:ok, _invoice} <- Invoices.create(transaction, cart) do  
      {:ok, transaction}  
    end  
  end  
end
```

Next up is the PaymentsApi. If you’ve ever integrated with a payment processor you’ve noticed that one of the biggest friction points of building out an integration is understanding the data models of the payment processor. Every payment processor has their own opinion on the data models used to represent different domains whether it is simple purchase/transactions like we’re attempting to model here, subscriptions, or invoices. When you’re working on these integrations and if you’re like me you’ll spend a lot of time reading and rereading the documentation. If your system integrates with multiple payment providers it is paramount that you develop internal models to represent these things and don’t pass the external models from the payment providers themselves around the inside of your application otherwise the cyclomatic complexity of the affected code will explode, as each part of your application will have to become capable of handling Nth different models all attempting to represent the same thing. Your system will remain a lot simpler to work on and reason about if it is only passing around one data model to represent each subdomain related to payment processing. That’s why the primary responsibility of the PaymentsApi module is to act as that boundary layer to serialize the internal format to the external, and to deserialize the external format to the internal format.

#### Braintree

```elixir
defmodule FooApp.PaymentsApi do  
  alias PaymentApi.{Serializer, Transaction, Provider}  
  alias FooApp.ShoppingCart  
  
  @spec execute_transaction(module(), ShoppingCart.t(), Provider.t()) :: ErrorMessage.t_res(Transaction.t())  
  def execute_transaction(adapter, cart, provider) do  
    with {:ok, transaction} <- adapter.purchase(create_transaction_attrs(adapter.serializer(), cart, provider)) do  
      {:ok, from_transaction_struct(adapter, transaction)}  
    end  
  end  
  
  defp from_transaction_struct(adapter, transaction) do  
    Serializer.from_transaction_struct(adapter.serializer(), transaction)  
  end  
  
  defp create_transaction_attrs(adapter_serializer, cart, provider) do  
    transaction = %Transaction{  
      customer_id: provider.customer_id,  
      payment_method_id: provider.payment_method_id,  
      amount: ShoppingCart.calculate_total(cart)  
    }  
  
    adapter_serializer.to_transaction_attrs(transaction)  
  end  
end
```

Adapter module directly interop’s with the payment processor and encapsulates a serializer module capable of translating between internal and external formats for data models. As we’ve already covered in previous sections the adapter is where the specific concerns related to the API we’re wrapping are handled. For example, you can see we translate specific Braintree error codes into not found errors, and all others are wrapped into internal server errors.

```elixir
defmodule PaymentApi.Braintree do  
  
  alias Braintree.Transaction  
  def serializer, do: PaymentApi.Braintree.Serializer  
  
  @spec purchase(map()) :: ErrorMessage.t_res(Braintree.Transaction.t())  
  def purchase(params) do  
    case Transaction.purchase(params) do  
    {:ok, transaction} ->  
      {:ok, transaction}  
    {  
    :error,  
      %Braintree.ErrorResponse{  
        errors: %{  
          subscription: %{  
            errors: [%{"code" => code, "message" => message}]  
          }  
        }  
      }  
    } when code in ["91903", "91904"] -> # these codes indicate problems with the payment method or customer id.  
      {:error, ErrorMessage.not_found(message)}  
    {:error, error} ->  
      {  
        :error,  
        ErrorMessage.internal_server_error(  
          "a problem was encountered while trying to process a transaction",  
          %{error: error}  
        )  
      }  
    end  
  end  
end

defmodule PaymentApi.Serializer do  
  alias PaymentApi.Transaction  
    
  @type transaction :: Braintree.Transaction.t() | Stripe.PaymentIntent.t()  
  
  @spec from_transaction_struct(module(), transaction) :: Transaction.t()  
  def from_transaction_struct(serializer, transaction) do  
    serializer.from_transaction_struct(transaction)  
  end  
end
```

The Serializer modules are very straightforward and somewhat like the Email modules from our first code example. They exist only to translate internal to external data models and vice versa.

```elixir
defmodule PaymentApi.Serializer.Braintree do  
  alias PaymentApi.Transaction  
    
  @spec from_transaction_struct(Braintree.Transaction.t()) :: Transaction.t()  
  def from_transaction_struct(%Braintree.Transaction{} = transaction) do  
    %Transaction{  
      id: transaction.id,  
      customer_id: transaction.customer.id,  
      amount: transaction.amount,  
      status: transaction.status,  
      created_at: string_to_datetime(transaction.created_at)  
    }  
  end  
  
  @spec to_transaction_attrs(Transaction.t()) :: map()  
  def to_transaction_attrs(%Transaction{} = transaction) do  
    %{  
      amount: transaction.amount,  
      payment_method_token: tranasction.payment_method_id  
      options: %{submit_for_settlement: true}  
    }  
  end  
end

defmodule FooApp.ProviderTypeConverter do  
  def to_adapter(:BRAINTREE), do: PaymentApi.Braintree  
  def to_adapter(:STRIPE), do: PaymentApi.Stripe  
end
```

#### Stripe

```elixir
defmodule PaymentApi.Stripe do  
  def serializer, do: PaymentApi.Stripe.Serializer  
    
  def purchase(params) do  
    params  
    |> Stripe.PaymentIntent.create()    |> handle_response()  
  end  
    
  defp handle_response({:ok, _} = response), do: response  
  defp handle_response(  
    {  
      :error,  
      %Stripe.Error{  
        message: message,  
        extra: %{http_status: 400, card_code: :resource_missing} = extra  
      }  
    }  
  ) do  
    {:error, ErrorMessage.not_found(message, extra)}  
  end  
end

defmodule PaymentApi.Stripe.Serializer do  
  alias PaymentApi.Transaction  
  
  @spec from_transaction_struct(Stripe.PaymentIntent.t()) :: Transaction.t()  
  def from_transaction_struct(%Stripe.PaymentIntent{} = payment_intent) do  
    %Transaction{  
      id: payment_intent.id,  
      customer_id: payment_intent.customer  
      amount: payment_intent.amount,  
      status: payment_intent.status,  
      created_at: DateTime.from_unix!(payment_intent.created_at)  
    }  
  end  
  
  
  
  @spec to_transaction_attrs(Transaction.t()) :: map()  
  def to_transaction_attrs(%Transaction{} = transaction) do  
    %{  
      amount: transaction.amount,  
      currency: transaction.currency,  
      confirmation_method: :automatic  
      confirm: true,  
      payment_method: transaction.payment_method_id  
    }  
  end  
end
```

While learning about these patterns the question eventually arises, when should we use these patterns, when should we not? Unfortunately, there are no silver bullet litmus tests for when we should introduce abstractions into our code bases. However, there are some ways we can feel out our solutions to try to make sure we’re still pointed to our north star of writing code that is easy to understand so that it remains easy to maintain. As I am considering which solutions to employ, I often ask myself a series of questions like these:

• Is the complexity introduced by the abstraction worth the cost?

• Does it introduce a bigger problem than it solves?

• Is the solution easily understood, or should the code just be written in its simplest terms?

I try to let the answers to these questions guide my own decision making. Even though I try to do my best to select the right design, I am human as many of you are, and sometimes I make the wrong choice. Fortunately, there are still ways to recover from this pit. Your work should be peer reviewed and hopefully your reviewer asks themselves those questions too and if they come up with answers that suggest the code isn’t easily understood, that the abstraction isn’t worth the cost because the design is too clever for its own good, or whatever else their instincts might be telling them, that they share this feedback and you’re willing to listen to reason. It’s not uncommon for an attempted abstraction or implementation of one of these design patterns to have some rough edges that need refining. Just because things aren’t 100% perfect doesn’t mean they have to be thrown out, if we work together with our peers to sharpen our designs, we can arrive at abstractions that become force multipliers for meeting the needs of the businesses we serve. Continued practice at asking yourselves these questions and encountering problem spaces that are easily and correctly modeled after one of these design patterns will serve to build your own confidence as you try to determine the best designs for your own systems.