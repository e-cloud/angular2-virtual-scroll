# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.4.2"></a>
## [0.4.2](https://github.com/e-cloud/ngx-virtual-scroll/compare/v0.4.1...v0.4.2) (2017-12-26)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/e-cloud/ngx-virtual-scroll/compare/v0.4.0...v0.4.1) (2017-11-22)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/e-cloud/ngx-virtual-scroll/compare/v0.3.0...v0.4.0) (2017-11-08)


### Features

* **deps:** upgrade deps and support Angular 5 ([c21fbdd](https://github.com/e-cloud/ngx-virtual-scroll/commit/c21fbdd))



<a name="0.3.0"></a>
# 0.3.0 (2017-10-12)


### Bug Fixes

* prevent memory leak when component is destroyed ([cfdaefa](https://github.com/e-cloud/ngx-virtual-scroll/commit/cfdaefa))


### Features

* add attribute selector ([4a80fb4](https://github.com/e-cloud/ngx-virtual-scroll/commit/4a80fb4))
* add exportAs to component ([06a6060](https://github.com/e-cloud/ngx-virtual-scroll/commit/06a6060))
* **bufferAmount:** add bufferAmount option ([fbea7d7](https://github.com/e-cloud/ngx-virtual-scroll/commit/fbea7d7))
* refine the logic and fix a bunch of problems ([de024cd](https://github.com/e-cloud/ngx-virtual-scroll/commit/de024cd))
* update the project structure with angular-cli and ng-packagr ([bb4306e](https://github.com/e-cloud/ngx-virtual-scroll/commit/bb4306e))


### Performance Improvements

* **requestAnimationFrame:** add a lock logic to refresh method ([ae7448f](https://github.com/e-cloud/ngx-virtual-scroll/commit/ae7448f))
* **startupLoop:** simplify the startupLoop logic and docs about why ([ea5ba42](https://github.com/e-cloud/ngx-virtual-scroll/commit/ea5ba42))
* move frequent style update logic outside ngZone ([c0e67dc](https://github.com/e-cloud/ngx-virtual-scroll/commit/c0e67dc))




# v0.2.2

* Fixes #94

# v0.2.1

* Added ability to get viewPortItems as a field instead of event
* Added easier ability of using window scrollbar

# v0.2.0

* Added ability to put other elements inside of scroll (Need to wrap list itself in @ContentChild('container'))
* Added ability to use any parent with scrollbar instead of this element (@input() parentScroll)

# v0.1.8

* fixes [#74](https://github.com/rintoj/angular2-virtual-scroll/issues/74)
* fix buffer for scroll to top amount [#71](https://github.com/rintoj/angular2-virtual-scroll/issues/71)

# v0.1.7

* import rxjs operators and object needed instead of RxJS library itself

# v0.1.6

* improve performance by using Observables for scroll event
* add attribute selector
* fixes #39 - infinite event loop with empty items array

# v0.1.5

* Bug fix: the data to "jump" once scrolled to the bottom, because maxStart is assumed to be evenly divisible by the number of items in each row. [#32](https://github.com/rintoj/angular2-virtual-scroll/issues/32)

# v0.1.4

* Bug fix: ensure that onScrollListener is actually defined before removing [#25](https://github.com/rintoj/angular2-virtual-scroll/issues/25)

# v0.1.3

* Feature: Add event "start", to be fired when at the beginning of the list
* Feature: Add event "end", to be fired when at the end of the list
* Bug Fix: BUG infinite request on (change) - use "end" instead of "change" [#20](https://github.com/rintoj/angular2-virtual-scroll/issues/20)

# v0.1.2

* Feature: Fire change event after startup [#21](https://github.com/rintoj/angular2-virtual-scroll/issues/21)

# v0.1.1

* Bug Fix: Update to lower amount of Elements, scroll issue, empty space on bottom [#22](https://github.com/rintoj/angular2-virtual-scroll/issues/22)

# v0.1.0

* Feature: [enable AoT #16](https://github.com/rintoj/angular2-virtual-scroll/issues/16)

# v0.0.9

* Feature: [Smooth scroll on webkit (mobile) #13](https://github.com/rintoj/angular2-virtual-scroll/issues/4) & [data from server #7](https://github.com/rintoj/angular2-virtual-scroll/issues/13)

# v0.0.8

* Feature: [Using virtual scroll with api #4](https://github.com/rintoj/angular2-virtual-scroll/issues/4) & [data from server #7](https://github.com/rintoj/angular2-virtual-scroll/issues/7)

# v0.0.7

* Bug fix: [Multi-column scroll is broken in the demo #6](https://github.com/rintoj/angular2-virtual-scroll/issues/6)

# v0.0.6

* Updating documentation

# v0.0.5

* Merging pull request: [Completely define ngOnChanges function signature #2](https://github.com/rintoj/angular2-virtual-scroll/pull/2)

# v0.0.4

* BREAKING CHANGE: Removed `marginX` and `marginY`. These are auto calculated now.
* Added support for list items with variable width and height. Use `childWidth` and `childHeight`
* Performance turning: removed padding using `height`. Now uses `transform`.

# v0.0.3

* Bug fix: virtual-scroll.js:73 Uncaught ReferenceError: __decorate is not defined #1

# v0.0.2

* Initial version
