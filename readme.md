# alertbirds-endpoint

## Purpose

This provides a node service to catch the http calls from Loggly's Alert Birds service and turn them into emails.

[Loggly]: http://loggly.com/

[Alert Birds]: http://alertbirds.com/

Loggly makes log aggregation super simple. Everything at [Pinion](http://pinion.gg) logs to Loggly.

## Installation

Clone this repository, configure it, and point your Alert Birds at it.

alertbirds-endpoint runs against both node v0.4.x and v0.6.x

## Configuration

Everything lives in conf/conf.js

conf/conf.js.example contains everything you need to get started. Just configure an SMTP server and a Loggly input and you're done!

Default port is 3000.
