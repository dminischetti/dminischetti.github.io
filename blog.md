---
layout: blog
title: Blog
permalink: /blog/
---

# Blog

{% for post in site.posts %}
## [{{ post.title }}]({{ post.url }})
*Published on {{ post.date | date: "%B %d, %Y" }}*

{{ post.excerpt }}

[Read More →]({{ post.url }})
<hr>
{% endfor %}