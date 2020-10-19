---
layout: post
comments: true
excerpt_separator: <!--more-->
title:  Extracting location history
date:   2017-10-21 14:00:00
categories: [DataScience, Python, WebScraping, Coding, Tools]
tags: [DataScience, Python, WebScraping, Coding, Tools]
---
**If you have an android phone then google logs your location.
Fortunately, it makes all of that data available to you via the "timeline" dashboard.
Unfortunately, there is no easy way to get it off there and into an IDE.
So we'll have to do this the hard way!**
<!--more-->

## Location History
What did you do yesterday? Last week? Or on August the 17th at 15:00?
The answer, at least to the last question, possibly used to be quite a stretch.
But as many things, this has changed with the advent of our everyday companion,
the smart phone.

If you have a smart phone and you carry it around with you, your whereabouts are
constantly logged and saved. For android phones with google maps, google infers
your position based on a mix of GPS, cell phone towers, WiFi name lookup,
and other factors, and saves it in a "location history". This data is available
to you via the (relatively new) "timeline" feature in google maps.

![Game example]({{ site.url }}/assets/extract-location-history_timeline.png)

## The Problem
As always, Google's dashboard is very intuitive to navigate and offers great
functionality. There is just one problem: I cannot summarise, report on, or
programmatically analyse my data. It's locked into google's systems.

Because our location data is undoubtedly our personal property, google offers
us the option to download it in `.kml` format. However, this is only available
via the web interface. If I wanted to build personalised reports on top of the
data, I would need programmatic access via an API that I can pass parameters
such as date and time to retrieve data dynamically. That is currently not
supported by google. But with a little bit of manual work, we will get there
nonetheless!

## The Solution
After a little bit of digging around I found [this Medium post](https://medium.com/alex-attia-blog/how-to-take-back-control-and-use-your-google-maps-data-683fb5d4043e)
and [this associated GitHub repository](https://github.com/alexattia/Maps-Location-History)
that got me 90% of the way very quickly. Alex, if you're reading this, thanks
a ton for putting all of that together! The code on GitHub was still missing
yearly and daily sub-setting functionality, so I added that in
[my repository](https://github.com/JanLauGe/c_google_timeline)
(pull request submitted!).

So how to use this? Here are the step-by-step instructions.

In bash:

```bash
# Clone the code repository
git clone https://github.com/JanLauGe/c_google_timeline
```

Next, we'll have to do some manual work. This is because we will need information
from our google account sign in, saved in our cookies, in order to authenticate
our `GET` requests for `KML` file downloads.
1. Open https://www.google.com/maps/timeline in Mozilla Firefox (I tried Chrome first, it did not work for me)
2. Inspect the page (`Ctrl + Shift + I`) and go to the Network tab
3. Enter the link below in the address line of your browser: https://www.google.com/maps/timeline/kml
4. A new event will appear in the inspect-network tab as a result of the request. Copy its content as a cURL
5. Paste the cURL string to a text editor and save it as a key file (I used '~/.env/.google_maps_cookie')

Now that we have the cookie information, we can go back to the fun part in Python:

```python
import datetime as DT
import process_location

# Get inputs --------------------------
# Date info
today = DT.date.today()
end_day = today.day
end_month = today.month
end_year = today.year

lastweek = today - DT.timedelta(days=7)
begin_day = lastweek.day
begin_month = lastweek.month
begin_year = lastweek.year

# Cookie info
cookie_content = open('~/.env/.google_maps_cookie', 'r').read()
# Remove line break at end of string
cookie_content = cookie_content[:-1]

# Where to save the files
folder = '~/google_timeline/data/'

# Get files --------------------------
process_location.create_kml_files(
    begin_year=begin_year,
    begin_month=begin_month,
    begin_day=begin_day,
    end_year=end_year,
    end_month=end_month,
    end_day=end_day,
    cookie_content=cookie_content,
    folder=folder)
```

This will download the `KML` files (one per day) for the last week.
I'll leave it at that for now. If you would like to know how to read the files
into a pandas data frame, check out [Alexandre Attia's repo](https://github.com/alexattia/Maps-Location-History),
or come back here later. I already have a specific application in mind for this,
but that is a story for another post.

As always, hope this is useful for you. Please leave a comment below.
I have enabled anonymous commenting to remove the entry hurdle of signing up to Disqus.
