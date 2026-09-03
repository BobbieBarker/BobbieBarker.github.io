---
title: 'The more things change, the more they stay the same'
date: '2026-09-02'
excerpt: 'Bad code has always been a bad deal. Handing the reading to a machine that bills by the token did not change that.'
tags: ['ai', 'architecture', 'code-quality', 'elixir']
draft: false
readingTime: '5 min'
authors: ['Chad King']
---

A pull request in a project I maintain arrived with this in it:

```elixir
with :ok <- validate_allowed_keys(attrs),
     :ok <- validate_non_empty(attrs, :id),
     :ok <- validate_atom(attrs, :artifact_type),
     :ok <- validate_non_empty_map(attrs, :evidence_bundle),
     :ok <- validate_expected_labels(attrs),
     :ok <- validate_fingerprint(attrs) do
  {:ok, struct(__MODULE__, attrs)}
end
```

Six private functions further down implemented those checks. Above them sat a hand-written struct, an `@enforce_keys` list, and an `@allowed_keys` list, all of which had to stay in agreement.

An Ecto embedded schema does all of this. It defines the data type, generates the struct, casts the input to the declared types, and puts the rules in a changeset. That leaves only the business-specific part worth writing by hand.

Validation is a solved problem in every ecosystem: Zod, Pydantic, Bean Validation, ActiveModel. Yet an LLM rolled its own solution. The result compiled, passed its tests, and looked thorough to anyone who did not already know the standard answer.

Before coding agents, this kind of code would never pass review. Validation is a solved and well-understood problem. This isn't a matter of architecture; it's a rookie mistake dressed up to look polished. That is what I mean by slop: code that appears complete but quietly shovels its unfinished parts downstream for others to deal with.

## Reading is the job

Put validation code in front of a developer, and they can tell you almost immediately whether the business rules are right. Fields, types, required values, ordinary constraints: all of it uses a vocabulary the ecosystem settled years ago. The only thing you need to deduce is the business rules unique to the specific application.

The ad hoc version makes you learn a private framework first. Does "non-empty" trim? Are empty maps legal? Are unknown keys rejected or ignored? Does it stop at the first failure, or collect them all? What shape is the error, and does it match the other twenty datatypes in this application?

The library lets you inspect the contract. The hand-rolled version makes you reverse-engineer it. That is where the money goes. Developers spend around [58 percent of their time on program comprehension](https://doi.org/10.1109/TSE.2017.2734091). Reading is the job. Writing is the short part at the end. Anything that makes reading harder is charged against the majority of the work, forever, to everyone who comes after.

And it is accumulation that gets you. In one experiment, a single instance of an anti-pattern like Blob or Spaghetti Code [barely registered](https://doi.org/10.1016/j.infsof.2020.106278). By contrast, two instances of the same anti-pattern measurably slowed people down and made them more likely to be wrong. One weird module is an annoyance. It is the second one that starts charging. None of this is new. It has long been known that bad code is a bad deal.

## LLMs are not magic

There is an assumption underneath a lot of unguided AI development: that the model can read as much code as you give it, understand whatever it finds, and route around any mess for free. That is not how an agent works. It searches, pulls files into context, follows call paths, compares implementations, runs tools, and goes back to files it has already opened when its first read turns out to be wrong. All of that is billed.

Researchers at Sonar built [matched pairs of repositories](https://arxiv.org/abs/2605.20049) with the same external behavior but different internal quality, then ran the same tasks on both sides using Claude Code. The agents passed at about the same rate either way. What changed was what it took to get there. On the cleaner side, the agent used roughly 7 percent fewer input tokens and went back to files it had already opened 33.8 percent less often. On tasks that crossed module boundaries, that number dropped by half.

The pass rate is the part people will fixate on, and it is the least interesting number in the study. Of course the agent finished. It finished by reading more, backtracking more, and spending more. If the only thing you measure is whether the task closed, the cost is invisible to you and fully visible on the invoice, which is what a human experiences too, minus the itemization. A single ugly function you read once. Inconsistent conventions spread across modules are something you keep going back to check.

## The repository is what the next Agent reads

Merged code stops being output and becomes input to the next agent. Agents work out how a codebase works by reading the codebase. Once that hand-rolled validator lands, it is a searchable example of how this project validates data. The next agent finds it, concludes that this is the local convention, and writes a second one. Now there are two, and it looks deliberate.

One study built [two-step chains](https://arxiv.org/abs/2606.21804) in which the same model performs the same follow-on task, varying only whether the code it inherited came from a human or an earlier agent. Inheriting from the agent was worse in twelve of sixteen comparisons, by as much as 13 points. The interesting part is what explained it. None of the usual complexity metrics did. What showed up was drift in input validation and error handling, which is the mistake in that pull request I referenced at the start of the document.

Another [watched agents extend their own work](https://arxiv.org/abs/2603.24755v2) across nearly 200 checkpoints, handing each one nothing but the repository the last one left behind. Structural erosion increased across 77 percent of trajectories, and the cost per checkpoint ended 2.2 times higher than it started. Some of that is just the codebase getting bigger, which is what codebases do: they grow over time. The tricky part is knowing whether that growth is justified and carrying value for the business, or whether it is just slop and bloat.

## Engineering the meta around the agent

None of this calls for a new discipline. What we have learned over the last 60 years of building software remains true. Set the standard, make the right pattern easy to find, review the code, and reject implementations that reinvent solved problems.

What changes is that the standard can no longer live in a senior developer's head. It has to sit somewhere the model reads. One tool you can use is an ADR that says when to use a schema and when to use an option validator. A golden example showing the full idiomatic implementation, including how the schema replaces the struct rather than sitting next to it, is a powerful mechanism because LLMs rely on pattern matching. When you give them a clear example, they will follow it. When it makes sense, and the validation can be broken down into a mechanical test, static checks for issues a machine can catch on its own can be game-changers.

An outline for an ADR documenting your validation standards:

```markdown
Title: Decision Record: Data Validation Standards

Status: Accepted | Draft

Context: Describe why validation standards are needed (e.g., inconsistency
in past approaches, AI/LLM-assisted coding, maintenance concerns).

Decision: State the preferred approach (e.g., "We use Ecto embedded schemas
for data validation, not custom-rolled validators.").

Consequences: Explain benefits/tradeoffs (e.g., predictability, shared
vocabulary, easier onboarding, less bespoke code).

Guidelines:

- Use Ecto embedded schemas for all input validation unless there is a
  justified exception.
- Place all schema and validator modules in the validation directory.
- Add new patterns to this ADR as exceptions arise.

Examples: Provide a sample schema and an example of discouraged hand-written
validators for comparison.
```

Telling the model to write clean code is not on that list. The checkpoint study tried exactly that, and quality-focused prompting improved the first checkpoint while doing nothing to the trajectory. Instructions are not a control. What you have to focus on is creating good signal around the agent's context to influence its inference.

The existing violations have to go, too, because every one left in place is a working example that argues against your ADR. Bad code poisons the model.

The actors changed, and the speed changed enormously. What it costs to work in a bad codebase did not. Bad code is harder to read. Inconsistent code is harder to change. Entropy accumulates unless somebody pushes back on it. The only real difference now is that we handed most of the reading to something that bills by the token, which makes it harder to pretend the reading was ever free.

The more things change, the more they stay the same.
