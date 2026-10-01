---
title: 'Large files are expensive'
date: '2026-09-30'
excerpt: 'Agents read a file before they edit it, so my 33,585-line module cost about 270,000 tokens every time one touched it. The design principles that prevent files like that are fifty years old. Token counts make the cost of ignoring them visible.'
tags: ['ai', 'architecture', 'code-quality', 'agentic-engineering']
draft: false
readingTime: '7 min'
authors: ['Chad King']
---

I had stopped sending coverage reports to an outside service, so an agent received a ticket to delete the code that communicated with it. The change was a three-chunk edit in one module and a one-line regex fix in another. Before an agent edits a file, it has to read it, which is the right rule: an edit made without the surrounding code can compile but still break something two functions away. The first module was 33,585 lines long, and the second was 17,452, so the agent read both in full to make four small edits. Eight minutes into the run, its context had filled and been compacted.

At about 8 tokens per line, the first file alone is roughly 270,000 tokens. The read rule charged the agent the full price of the file and made that price impossible to miss. Making the read cheaper would have hidden the cost without changing it. The module was expensive to read because it combined CI monitoring, failure diagnosis, fix dispatch, and the merge queue in one place, so changing any one of them required loading all of them. Recognizing that was the first part of my job as the human in this system.

## What a file costs

I tokenized my Elixir codebase with three open tokenizers (GLM-5.3, Kimi-K3, and OpenAI's o200k). They agreed within 1% at about 8.6 tokens per line, and a TypeScript project came out at 10.2. With a 200,000-token budget for code, leaving room in a larger context window for the system prompt, conversation, and other tool output, the cost of a full read works out like this:

| File size | Tokens per read | Full reads in 200k |
| --- | --- | --- |
| 300 lines | ~2.6k | ~77 |
| 500 lines | ~4.3k | ~46 |
| 800 lines | ~6.9k | ~29 |
| 1,500 lines | ~12.9k | ~15 |
| 3,000 lines | ~25.8k | ~7 |

A change rarely reads just one file. It reads the target and follows calls into the surrounding modules, but most of those are small: the median file in my codebase is 142 lines, and 90% are under 640. One 800-line target plus six collaborators near the median totals about 14,000 tokens of code. Opening the 33,585-line module costs more than the whole budget.

A line limit sets a ceiling on the worst single read. Set it too low, and you split responsibilities that belong together, forcing every change to open more files to follow one idea. Long before LLMs, I considered files over 1,000 lines a smell, so 800 lines felt like a natural default. At about 7,000 tokens per file, it leaves room for close to 30 full reads in that budget.

A code graph solves the search half of this. Ask it what calls a function, and it answers directly, so the agent doesn't have to grep the repository. It can only point to a file, though. If the change is at line 847 of a 2,500-line module, the agent still reads all 2,500 lines, about 21,000 tokens. The graph delivered the agent to the right address. The building is still oversized.

## How it got that big

The module grew one change at a time. Each change added a function next to the code it was meant to modify, because that was the smallest diff and it matched what was already there. Agents rarely step back to restructure the code they are working in, and studies of AI-assisted and agent-written code show that habit at scale.

[GitClear's analysis of 211 million changed lines](https://www.gitclear.com/ai_assistant_code_quality_2025_research) found that moved lines, a proxy for refactoring, fell from 25% of changes in 2021 to under 10% in 2024. A [Carnegie Mellon study of open-source projects that adopted Cursor](https://arxiv.org/abs/2511.04427) estimated a 41.6% increase in code complexity after adoption and linked higher complexity to fewer lines added in later months. A [study of agent refactoring in Java projects](https://arxiv.org/abs/2511.04824) found that low-level changes, such as renames and type changes, dominated the edits.

On August 2, I added a warning to the instructions that every implementation agent receives, naming this file and one other and telling agents not to add to them. The larger file was 11,062 lines that day and 33,585 eight weeks later. Of the 178 commits that touched either file over three months, 124 created no new module.

Three other factors in the agent's environment outweighed the warning. The same instructions told agents to change only the files named in a ticket and to stop and ask before touching others, so the compliant place for new code was a file already on the list. Review judged each diff on its own, and adding one more function to a large file reads fine in a diff. Agents also learn a codebase by reading it, and the most visible example in mine was the 33,000-line file. I argued in [The more things change, the more they stay the same](/writing/the-more-things-change-the-more-they-stay-the-same) that instructions need support from the examples and checks around an agent, and this file shows what happens when those signals disagree.

## What I changed

I started by writing the principle down as an [architecture decision record](https://github.com/BobbieBarker/adrs/blob/main/adrs/software-design/adr-001-design-modules-for-information-hiding-high-cohesion-and-low-coupling.md). It describes modules organized around cohesive responsibilities, with implementation choices hidden behind interfaces and as little knowledge as possible shared between concerns that change for different reasons. It treats file length as a signal to check cohesion, and it requires every new boundary to be worth the cost of its interface, so cutting a file in half to meet a limit doesn't count as a design.

Then I used that rule to determine what an agent does. The implementation instructions now make placement part of every change. When a ticket introduces a responsibility that no existing module owns, creating that module is part of the ticket, and the agent doesn't have to stop and ask first. Review will treat a new responsibility landing in a module that owns a different one as a blocking finding, which holds the merge until it's fixed. The reviewer will see each touched file's size and recent growth. A [Credo check](https://hexdocs.pm/forge_credo_checks/ForgeCredoChecks.FileLength.html) now fails any source file over 800 lines. A project with older code can raise the limit or list its existing oversized files, and the check flags an exemption whose file is back under the limit, so exemptions can't outlive their splits. The largest files are being split along their responsibilities because every agent who opens them treats them as the local example.

## The same principles

David Parnas argued in 1972 that modules should be organized around [the design decisions they hide](https://doi.org/10.1145/361598.361623). [Stevens, Myers, and Constantine](https://doi.org/10.1147/sj.132.0115) wrote about coupling and cohesion in 1974. The decision record I wrote for my agents rests on principles a team could have used in any decade since.

LLMs made code cheap to generate. They didn't change what good code looks like or what bad code costs to own. A 33,000-line module was expensive before agents existed, and people paid for it in reading time and in bugs from code nobody had read closely. Nobody itemized that cost, so it was easy to ignore. An agent itemizes it because every file it reads has a token count. That measurement is the only new part of this story.

The engineer's part hasn't changed either. Here, it involves noticing the pattern behind a cost, measuring that cost, choosing the principle, and building it into the instructions and the review and lint rules the agents work under. Agents optimize the change in front of them, so someone has to own where the codebase is going.

