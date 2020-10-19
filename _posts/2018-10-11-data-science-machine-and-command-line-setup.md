---
layout: post
comments: true
excerpt_separator: <!--more-->
title:  Data Science Machine and Command Line Setup
description: How to go from zero to Data Science at the command line on a brand new Mac
image: /assets/bashsetup_powerlevel9k.gif
date:   2018-10-12 13:00:00
categories: [DataScience, Tools, Coding]
tags: [DataScience, Tools, Coding]
---
**Data Scientists require a very particular toolset for their everyday tasks,
but unlike software developers, few of them spend a lot of time optimising this
toolset for their specific needs. I compiled a simple step-by-step guide that
helps to automate the process setting up a brand new data science machine and
making it work for you by customising the command prompt and using a dotfile
approach to manage configuration, identity, and access information.
This gets you from zero to Data Science in minutes on MacOS**

<!--more-->

I've had to set up new data science laptops twice in the last couple of months
and got frustrated with the tedious setup procedures. Installing libraries,
customising settings, how do I switch RStudio to night mode again? Moreover,
I have two new starters joining my team in the coming weeks which means that
more system setups are just around the corner. So I decided to compile a
guide with scripts and commands that make this process smoother and faster.

There is many things to be said for an automatic setup over manual installation.
Speed, reproducibility, a standardised configuration between all team members,
and the opportunity for programmatic customisation. Among software developers
this approach, called `.dotfile` configuration, is common practice and great
introductions are available
[here](https://medium.com/@webprolific/getting-started-with-dotfiles-43c3602fd789)
and [here](https://medium.freecodecamp.org/dive-into-dotfiles-part-1-e4eb1003cff6).
However, so far I have only rarely encountered it on data science teams.
This is despite the fact that data scientists frequently work with complex
statements at the command line, have to pay particular attention to system
setup to ensure reproducibility of their experiments, use version control, and
commonly deal with data from a wide range of sources, many of which will require
API tokens or access credentials. So think of this as a data science specific
`dotfile` setup. There are three main components to this approach:

1. using command line tools and package managers instead of graphic installers
automate first-time system setup, because this is faster, more reproducible,
and more easily maintainable.
2. set up a beautiful, efficient, and powerful command line configuration,
because it will make everyday tasks easier, because it's awesome and because we can!
3. create a `.dotfile` repository that saves settings, application preferences,
api keys, and access tokens, because it is more convenient and more secure than
glueing post-its to our monitor or hard-coding passwords and tokens into our
code that is then pushed to [GitHub](https://github.com/JanLauGe).

Most parts of this article can be used in isolation, so unlike the British
Prime Minister you are free to "cherry-pick" if you are so inclined.

I am assuming here that you're using MacOS. Parts of it may be transferable to
a linux machine, much of it will need modification. If you're on Windows...
good luck! It may work with the new
[Ubuntu for Windows](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux)?
If you get a chance to test this, please let me know in the comment section below.


### Initial Setup

We start of by installing install [Homebrew](https://brew.sh/),
the "missing package manager for MacOS"! This bit actually requires some user
input (<yes> and <password>), so we will split that from the rest of the basic
installations.

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Once that is done we can use `homebrew` for some additional household essentials.

```bash
# we will need these later
brew install wget htop git git-lfs libgit2 keychain

# I like these, so I'll install them here as well
brew cask install google-chrome atom slack vlc spotify dropbox
# You can launch and configure apps like this
open ~/Applications/Dropbox.app

# install gcc and java,
# a lot of the data science tools we will install later depend on them
# (some of these may require your password again)
brew install gcc

brew tap caskroom/versions

brew cask install java
brew cask install java8
brew install jenv
```

### Powerlevel9k Command Line

Now it's time to beef up our command line. This is something that many
software developers and engineers spend a lot of time on, to the point where
some are holding competitions to show off their great shells. Many Data
Scientists, on the other hand, seem to neglect command line customisation.
I think that this is a mistake. Let me convince you by highlighting some of
the neat extra features that we can add with a little bit of extra setup effort:

* beautiful command prompt
* syntax highlighting
* auto completion
* read/write flags
* execution timing
* git support with repo status tracking

![example powerlevel9k prompt]({{ site.url }}/assets/bashsetup_powerlevel9k.gif)

The most nerdy set of productivity tools on the block! To make this work
we will need [iTerm2](https://www.iterm2.com/) and [zsh](http://www.zsh.org/).
iTerm2 is a macOS terminal replacement with many additional features, such as
more display customisation, better hotkeys, and fantastic split pane
functionality. Zsh is a shell designed for interactive use. It works
particularly well with [`oh-my-zsh`](https://ohmyz.sh/), a configuration tool
that helps with setting up everything just the way we like it. They have great
stickers, too ;)

While we're at it we will also install the Powerline terminal fonts, which
will be needed for [powerlevel9k](https://github.com/bhilburn/powerlevel9k),
the zsh theme of my choosing.

```bash
# install iTerm2
brew cask install iterm2

# install zsh
brew install zsh

# get oh-my-zsh configuration tool
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
# (this may require your password again)

# get powerlevel9k theme for zsh
git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k
# and the corresponding font
wget -O /Library/Fonts/font_sourcecodepro_powerline_awesomeregular.ttf https://github.com/Falkor/dotfiles/blob/master/fonts/SourceCodePro+Powerline+Awesome+Regular.ttf?raw=true
```

The oh-my-zsh installation script changes your default shell to zsh and creates
the file `.zshrc`. Just like `.bash_profile` for bash, this file is
automatically sourced when a new zsh session is launched. From now on you
should always use `.zshrc` instead of `.bash_profile`, for example when setting
a new standard conda environment. Notice that `.zshrc` comes with a lot of
options that are commented out. Feel free to go through the file and uncomment
the modifications that may be of interest to you.

You should also add iTerm2 to the dock bar and/or assign a hot key of your
choosing. Change the colour scheme (`Menu bar` > `Profiles` >
`Open Profiles...` > `Select "Default"` > `Edit Profiles...`) as you see fit.
Definitively change the font to `SourceCodePro+Powerline+Awesome Regular`.
This last step is important as **POWERLEVEL9K WON'T WORK PROPERLY WITHOUT THIS**
and you will end up with cryptic symbols on your prompt instead.

If you don't have strong feelings about
colour style preference, feel free to use my profile template. You can install
it as a dynamic profile with the command below. DynamicProfiles enable you to
share your preferences between different machines. You can create your own by
exporting your profile from the profile menu to a JSON file and copying it to
the same location:

```bash
# copy the profile settings for iTerm2 to DynamicProfiles folder
wget -O ~/Library/Application\ Support/iTerm2/DynamicProfiles https://github.com/JanLauGe/.dotfiles/blob/master/iterm_profile.json
```

There is a wide range of plugins available for iTerm2 and zsh. I
automatically add a few that I find useful by installing them with homebrew.
Afterwards I add them to the `.zshrc` configuration file with `sed` or by
pipe-appending (`>>`) a string to the end of the file.

In case you're unfamiliar with these commands: `sed` looks for a string in a
file using [regular expression](https://regexr.com/) and replaces the found
string with a replacement string. The inplace flag `-i ''` is Mac specific and
tells `sed` to overwrite the old file with the new updated version. The `>>`
operator appends to a file or creates the file if it doesn't exist.

Side note: Alternatively, we could just copy
a pre-existing `.zshrc` but I felt that adding lines using `sed` keeps things
more transparent and allows for more of a mix-and-match approach where you can
choose the bits you like and leave out the ones that are not useful to you.

```bash
# change zsh theme to powerlevel9k
sed -i '' 's/ZSH_THEME="robbyrussell"/POWERLEVEL9K_MODE='awesome-patched'\
ZSH_THEME="powerlevel9k\/powerlevel9k"/g' .zshrc

# Add auto suggestions (for Oh My Zsh) suggests the commands you used
# in your terminal history. You just have to type → to fill it entirely!
# Note: $ZSH_CUSTOM/plugins path is by default ~/.oh-my-zsh/custom/plugins
brew install zsh-autosuggestions zsh-syntax-highlighting

# Add the plugins to the list of plugins in ~/.zshrc configuration file :
sed -i '' '/^plugins=(/  a\
 \ \ zsh-autosuggestions \
 \ \ web-search \
 \ \ jsontools \
 \ \ macports \
 \ \ node \
 \ \ osx \
 \ \ sudo \
 \ \ thor \
 \ \ docker \
' .zshrc

# set default user in .zshrc to avoid the nasty username@machine prompt
echo 'export DEFAULT_USER="$(whoami)"' >> .zshrc
```


### Data Science Essentials

[Data science at the command line](https://www.datascienceatthecommandline.com/)
is great, but I doubt it will be enough to do all of your day-to-day tasks.
We need R & Python, and while the GUI installers for
[Rstudio](https://www.rstudio.com/) and [Anaconda](https://www.anaconda.com)
make the installation child's play, it would be nice to have it as part of this
initial setup script as well. Moreover, I find myself accumulating eclectic
collections of packages and libraries. Instead of reinstalling all of these
manually I have included them here as well:

```bash
#### install anaconda
# May need updating for conda version
wget -O anaconda.sh https://repo.anaconda.com/archive/Anaconda3-5.3.0-MacOSX-x86_64.sh
bash anaconda.sh
rm anaconda.sh
# append conda path to bash profile
echo 'export PATH="~/anaconda3/bin:$PATH"' >> ~/.zshrc
# reload profile
source .zshrc

# create new anaconda virtual environments
conda update conda
conda config --add channels conda-forge
conda create --name dev2 python=2.7
conda create --name dev3 python=3.6
# and switch to it to avoid using the system python
source activate dev3
# do this every time we start a new session
# assuming you want to use python3 by default
echo 'source activate dev3' >> ~/.zshrc
# Install a few libraries that do not ship with anaconda
pip install awscli tensorflow tensorflow-gpu keras


#### install R and RStudio
# this is required for some advanced plotting
brew cask install xquartz # (will need password again)
brew install --with-x11 r
brew cask install --appdir=/Applications rstudio
# Note the --appdir option which will use /Applications instead of ~/Applications


# set up rJava; this can be a pain!
# I used these instructions: https://zhiyzuo.github.io/installation-rJava/
# consult google if you get stuck here

# set java environmental variables for the profile
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
# (you may need to update version number here)
echo 'export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc
source ~/.zshrc
# make sure to set this to the version that you installed (`java -version`)
jenv add /Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home
jenv global oracle64-1.8.0_181
# prepare installation and install rJava by building from source
R CMD javareconf
RScript -e "install.packages('rJava',\
  repos='http://cran.us.r-project.org',\
  type='source')"

# install R packages
RScript -e "install.packages(c(\
  'cluster','crayon','crosstalk','curl','CVST','data.table','DBI',\
  'devtools','doMC','dtplyr','foreach','foreign','ggplot2','ggthemes','glmnet',\
  'haven','here','htmltools','htmlwidgets','httr','igraph','jsonlite','knitr',\
  'labeling','lattice','lazyeval','leaflet','lubridate','magrittr','markdown',\
  'mime','praise','psych','purrr','raster','RColorBrewer','Rcpp','readr',\
  'rmarkdown','rpart','rvest','scales','shiny','stringr','survival','testthat',\
  'units','viridis','xml2','aws.s3','checkmate','feather','future',\
  'gapminder','keras','lintr','plotly','plotROC','prettyunits','pROC','progress',\
  'randomForest','ranger','reticulate','rJava','RJDBC','RJSONIO','RODBC',\
  'roxygen2','RPostgreSQL','Rtsne','slackr','sf','stringdist','tensorflow',\
  'text2vec','vegan','xgboost','XML','tidyverse'),\
  repos='http://cran.us.r-project.org')"
# This library for snowflake is only available on github
RScript -e "library(devtools); install_github('snowflakedb/dplyr-snowflakedb')"
```

Consider adding `/bin/zsh` to your RStudio global options under
`Global Options...` > `Terminal` > `Custom shell binary` to keep your
RStudio Terminal sessions in tune with the custom terminal we set up here.

### Settings and Access

So now we are done with the basic setup on our local machine. However, there are
still ssh keys, api access tokens, and config files to configure. This can take
a lot of time and energy, and having different tokens on different machines
can be confusing or even unsafe (I have seen far too many people hard-code
their AWS credentials into their notebooks!).

I've therefore gone for an approach of creating a folder with all the files for
identity management and protecting it with a single strong master password.
For obvious reasons I will not go into too much detail on my exact approach to
this, but let's just say that we have synced all our identity files to a local
folder called `.dotfiles`. From there we can sync them into our home directory,
as succinctly explained by Ajmal Siddiqui
[in this post](https://medium.freecodecamp.org/dive-into-dotfiles-part-2-6321b4a73608).

```bash
rsync .dotfiles ~
```

and since we want to do that whenever we start a new terminal session:

```bash
echo 'rsync .dotfiles ~' >> .zshrc
```

This will synchronise all files in the `.dotfiles` folder to the home directory
where they are available to the various applications or our custom scripts
that may use them. Files that I now use this for include:

* `.ssh` - ssh keys for Github, AWS, etc.
* `.aws` - AWS credentials needed for the [`aws cli`](https://aws.amazon.com/cli/)
* `.gitconfig` - To track my contributions to version controlled code bases
* `.kaggle.json` - Access token to use the [new Kaggle API](https://github.com/Kaggle/kaggle-api)
* `.google` - Access token for the google maps SDK that I used [here](https://janlauge.github.io/2017/extracting-location-history/)

So that's all! As always, I hope it is useful for someone. Please let me know
any thoughts you may have in the comments below. Also, follow me on
[twitter](https://twitter.com/JanLauGe), connect with me on
[linkedIn](https://www.linkedin.com/in/laurensgeffert/),
and feel free to email me.
