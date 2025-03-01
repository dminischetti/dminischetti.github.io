---
title: "Why I Switched from Jekyll to Hugo (And Why You Might Want To, Too)"
date: 2025-03-03 00:00:00 -0700
description: "Migrating from Jekyll to Hugo wasn’t as smooth as I expected, but it was worth it. Here’s what broke, what I learned, and why I’ll never go back."
tags: ["blogging", "static site generators", "hugo", "jekyll", "web development", "self-hosting"]
cover:
  image: "https://i.imgur.com/MbBW8io.png"
---
I started blogging last summer because I wanted my own space on the internet. No algorithms deciding what gets seen, no distractions, no data-harvesting social platforms. Just me, my words, and a digital home I actually controlled.

At first, I went with Jekyll because it was GitHub Pages’ default option. It seemed simple enough. But the more I used it, the more I realized Jekyll was like an old car: it gets you where you need to go, but every time you take it out, you have to fix something under the hood.

The problems started piling up:

- **Slow build times** – A simple edit? Better grab a coffee.
- **Ruby dependencies** – Installing Jekyll felt like summoning a demon sometimes.
- **Outdated themes** – I wanted something modern, not a blog that looked straight out of 2012.

So, I started looking for alternatives. I tried:

- **Ghost** – Looked great, but way too much for a simple blog.
- **WordPress** – Too bloated. I didn’t need a content empire.
- **Eleventy** – Cool, but I didn’t want to spend my time building the whole setup from scratch.
- **Pelican** – Python-based, and while I respect that, it didn’t click with me.

Then, I found **Hugo**. It was fast, simple, and didn’t make me question my life choices.

* * *

## **Why I Host on GitHub Pages**

I kept everything on GitHub Pages because:

- **It’s free** – No hosting costs. Free is always good.
- **Automatic updates** – Every Git commit deploys the site like magic.
- **Easy domain linking** – My Namecheap domain worked right away, no headaches.
- **No maintenance** – No server issues, no software updates. Just write and publish.
- **Version control built-in** – I can roll back changes if I break something (which happens often).

With Hugo and GitHub Pages, I focus on writing instead of fighting with servers.

* * *

## **Step 1: Installing Hugo (The First Time a Setup Actually Went Smoothly)**

Unlike Jekyll, where installing it feels like cracking a safe, Hugo is just a single binary.

- **On macOS**:

        bashCopyEditbrew install hugo
- **On Windows**: Download it from [Hugo’s GitHub releases](https://github.com/gohugoio/hugo/releases) and add it to your PATH.
- **On Linux**:

        bashCopyEditsudo apt install hugo

To verify the installation:

    bashCopyEdithugo version

That’s it. No Bundler, no dependencies, no cursing at my screen.

* * *

## **Step 2: Moving My Jekyll Posts (This Should Have Been Easy, But…)**

At first, I thought I could just copy my Markdown files into Hugo’s `content/posts/` folder, and everything would work.

It didn’t.

### **What Broke?**

- **Folder structure** – Jekyll stores posts in `_posts/`, but Hugo expects them in `content/posts/`.
- **Front matter differences** – Jekyll uses YAML, but Hugo supports TOML, YAML, or JSON.
- **Permalinks** – Jekyll and Hugo structure URLs differently.

To move the posts:

    bashCopyEditmkdir -p content/postsmv _posts/* content/posts/

Then, I had to clean up the front matter:

    bashCopyEditfind content/posts -type f -name "*.md" -exec sed -i 's/layout: post//g' {} \;

That was when I realized: Markdown is Markdown… **until it isn’t.**

* * *

## **Step 3: Choosing a Theme (A Black Hole of Decision Making)**

I tested multiple themes before settling on PaperMod:

- **Mainroad** – Clean, but too plain.
- **Anubis** – A dark theme with style, but not quite what I wanted.
- **Hello-Friend** – Nice, but missing features I needed.
- **PaperMod** – Minimalist, fast, and easy to tweak.

Installing PaperMod was simple:

    bashCopyEditgit submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod

Then, I updated `config.toml`:

    tomlCopyEdittheme = "PaperMod"

For now, it works. But I’ll probably keep tweaking things forever.

* * *

## **Step 4: Fixing My Broken Blog (Because of Course It Was Broken)**

I ran:

    bashCopyEdithugo server -D

…and was immediately greeted by broken links, missing images, and general chaos.

### **What Went Wrong?**

- **Jekyll’s `/assets/` folder didn’t move** – I had to copy it manually.
- **Relative links broke** – Hugo handles them differently than Jekyll.
- **Markdown formatting was stricter** – Sloppy formatting? Not happening.

After fixing those, my site **finally** worked.

* * *

## **Step 5: Deploying to GitHub Pages (This Also Should Have Been Easy, But…)**

Since I was sticking with GitHub Pages, I had to tweak my deployment process.

1. **Run Hugo’s build command**

        bashCopyEdithugo

    This generates a `public/` folder with the static files.
2. **Push to GitHub**

        bashCopyEditcd publicgit initgit add .git commit -m "Deploy Hugo site"git push origin main

At first, I manually deployed, but I eventually set up **GitHub Actions** to automate everything.

* * *

## **Step 6: Customizing PaperMod (Because I Can’t Leave Things Alone)**

### **Enable Dark Mode**

    tomlCopyEdit[params] defaultTheme = "dark"

### **Enable Search**

    tomlCopyEdit[outputs] home = ["HTML", "RSS", "JSON"]

### **Customize Sidebar Profile**

    tomlCopyEdit[params.profileMode] enabled = true title = "About Me" subtitle = "Minimalist, Developer, Writer" imageUrl = "images/profile.jpg"

Every time I think I’m done tweaking, I find something else to change.

* * *

## **Was It Worth It?**

- **Hugo is fast** – My site builds in milliseconds instead of making me wait.
- **No more Ruby dependencies** – No `bundle exec`, no errors, no wasted time.
- **PaperMod works out of the box** – A rare theme that doesn’t require days of customization.

### **What I’d Do Differently**

- Plan URL redirects better. My old Jekyll links broke, and I had to fix them manually.
- Test locally before pushing. I pushed broken pages more than once.
- Take notes while migrating. Some mistakes could have been avoided if I had written things down.

* * *

## **Why I’ll Keep Blogging**

This whole migration wasn’t just about switching platforms.

- **A personal blog is like a journal** – It helps me organize my thoughts.
- **It’s my escape from social media** – No ads, no distractions, no algorithm deciding what gets seen.
- **It’s mine, forever** – No company can shadowban or de-platform me.

I don’t know if PaperMod will be my final theme. I don’t know if I’ll keep tweaking every little thing.

What I do know is this:

I like writing. I like experimenting. And I like having a space that’s truly mine.

If you're thinking of switching to Hugo, do it. Just be ready for the unexpected.