---
title: "Why I Switched from Jekyll to Hugo (And Why You Might Too)"
date: 2025-03-03T00:00:00
description: "Migrating from Jekyll to Hugo wasn’t as smooth as I expected, but it was worth it. Here’s what broke, what I learned, and why I’ll never go back."
tags: ["blogging", "static site generators", "hugo", "jekyll", "web development", "self-hosting"]
cover:
  image: "/images/why-i-switched-from-jekyll-to-hugo.png"
---
# **Why I Switched from Jekyll to Hugo (And Why You Might Too)**  

I started blogging last summer because I wanted my own space on the internet. No algorithms, no distractions, no social media noise—just a place I actually controlled.  

At first, I went with Jekyll because it was GitHub Pages’ default. It worked… *until it didn’t.*  

Jekyll was like an old car—reliable but constantly needing maintenance. The issues kept piling up:  

- **Slow build times** – A simple edit? Better grab a coffee.  
- **Ruby dependencies** – Installing Jekyll felt like summoning a demon.  
- **Outdated themes** – I wanted something modern, not a blog that looked straight out of 2012.  

I tried alternatives:  

- **Ghost** – Overkill for a simple blog.  
- **WordPress** – Too bloated.  
- **Eleventy** – Cool, but required too much setup.  
- **Pelican** – Python-based, but didn’t click with me.  

Then I found **Hugo**—fast, simple, and didn’t make me question my life choices.  

---

## **Why I Stuck with GitHub Pages**  

I kept everything on **GitHub Pages** because:  

- **It’s free** – No hosting costs. Free is always good.  
- **Automatic updates** – Every Git commit deploys the site instantly.  
- **Easy domain linking** – My Namecheap domain worked without hassle.  
- **No maintenance** – No server issues, no software updates. Just write and publish.  
- **Version control built-in** – I can roll back changes if I break something (*which happens often*).  

With Hugo + GitHub Pages, I could focus on writing instead of debugging my blog.  

---

## **Step 1: Installing Hugo (For Once, a Smooth Setup)**  

Unlike Jekyll, which requires `bundle install` and a blood sacrifice, Hugo is just a single binary.  

- **On macOS**:

    brew install hugo
- **On Windows**: Download it from [Hugo’s GitHub releases](https://github.com/gohugoio/hugo/releases) and add it to your PATH.
- **On Linux**:

    sudo apt install hugo

To verify the installation:

    hugo version

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

    mkdir -p content/posts
    mv _posts/* content/posts/

Then, I had to clean up the front matter:

    find content/posts -type f -name "*.
    md" -exec 
    sed -i 's/layout: post//g' {} \;

That was when I realized: Markdown is Markdown… **until it isn’t.**

* * *

## **Step 3: Choosing a Theme (A Black Hole of Decision Making)**

I tested multiple themes before settling on PaperMod:

- **Mainroad** – Clean, but too plain.
- **Anubis** – A dark theme with style, but not quite what I wanted.
- **Hello-Friend** – Nice, but missing features I needed.
- **PaperMod** – Minimalist, fast, and easy to tweak.

Installing PaperMod was simple:

    git submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod

Then, I updated `config.toml`:

    theme = "PaperMod"

For now, it works. But I’ll probably keep tweaking things forever.

* * *

## **Step 4: Fixing My Broken Blog (Because of Course It Was Broken)**

I ran:

    hugo server -D

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

        hugo

    This generates a `public/` folder with the static files.
2. **Push to GitHub**

        cd public
        git initgit add .git commit -m "Deploy Hugo site"
        git push origin main

At first, I manually deployed, but I eventually set up **GitHub Actions** to automate everything.

* * *

## **Step 6: Customizing PaperMod (Because I Can’t Leave Things Alone)**

### **Enable Dark Mode**

    [params] defaultTheme = "dark"

### **Enable Search**

    [outputs] home = ["HTML", "RSS", "JSON"]

### **Customize Sidebar Profile**

    [params.profileMode] enabled = true title = "About Me" subtitle = "Minimalist, Developer, Writer" imageUrl = "images/profile.jpg"

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