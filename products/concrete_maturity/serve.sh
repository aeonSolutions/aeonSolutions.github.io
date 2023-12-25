# /usr/bin/sh
bundle exec jekyll serve --host 0.0.0.0 2>&1 | egrep -v 'deprecated'