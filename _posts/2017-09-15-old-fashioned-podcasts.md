---
layout: post
comments: true
excerpt_separator: <!--more-->
title:  Old-fashioned Podcasts
date:   2017-09-15 23:00:00
categories: [Coding, Python, Tools]
tags: [Coding, Python, Tools]
---
**How to listen to your favourite podcast without podcast app? These few lines of python might be able to help!**
<!--more-->

### The Problem
My brother recently introduced me to a new podcast, [RadioWissen](http://www.br-online.de/podcast/mp3-download/bayern2/mp3-download-podcast-radiowissen.shtml). I can thoroughly recommend it to all German speakers. If you do not speak German, you will have to stick with the Radio4 gems such as [More or less, behind the stats](http://www.bbc.co.uk/programmes/p02nrss1/episodes/downloads). Now, my brother is a "laggard" in terms of technological adaptation, and as a result he does not own a smart phone. Instead, he downloads podcasts as mp3 files to his desktop PC. He wanted to download all episodes of RadioWissen, but with over 2 000 episodes published to date, this would have been very tedious to do manually.

![adaptation of new technologies]({{ site.url }}/assets/podcasts_innovation.jpg)

*Caricature by Tom Fishburne, taken from [Pinterest](https://www.pinterest.co.uk/timeldridge/diffusion-of-innovations/)*

### The Solution
Enter XML files that are behind the popular RSS feed format. Like any major podcast programme, RadioWissen lists all episodes in an XML file on their website, including file names and meta data. This provides the perfect basis to iterate over and programmatically download episodes. Below is my approach in python. I am using the "BeautifulSoup" library to extract URLs and the "requests" library to retrieve the files.

```python
from bs4 import BeautifulSoup
import requests

def getFile(url):
    '''Download file from URL, preserve file name'''

    # Get name for local file
    local_filename = url.split('/')[-1]

    # Get and write content
    r = requests.get(url, stream=True)
    with open(local_filename, 'wb') as f:
        f.write(r.content)
    # Print filename as confirmation
    return local_filename


# Address of the xml doc containing all mp3 file names and locations
xml_address = 'http://www.br-online.de/podcast/radiowissen/cast.xml'
# Get text and turn it from xml into BeautifulSoup
soup = BeautifulSoup(requests.get(xml_address).text)

# Download the latest episode
episode = soup.find_all('enclosure')[0]
source_address = episode['url']
getFile(source_address)
```

You can also download all episodes using the code snippet below, but like I said, there are over 2 000 episodes published to date, so this will take several hours to complete!

```python
# Download all episodes
for episode in soup.find_all('enclosure'):

    Extract url
    source_address = episode['url']
    print('downloading' + source_address)
    getFile(source_address)
```

I am still developing my python skills, which are more basic than my R knowledge. I felt like this little task was the perfect practice exercise for me, and I would be grateful for any feedback, constructive criticism, and comments on my approach.
