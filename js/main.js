$(() => {
  // set scroll event listener
  $(window).scroll(() => {
    // get scroll top
    const scrollTop = $(window).scrollTop();
    // handle all the scroll stuff
    headerHandler.name.scroll(scrollTop);
    headerHandler.nav.scroll(scrollTop);
    projectHandler.scroll(scrollTop);
  })

  $('.nav-button').click(() => {
    $('nav.mobile').toggleClass('open');
  });

  $(window).resize(() => {
    $(window).scroll();
  })


  // create a size handler that gets certain needed sizes when asked
  const sizeHandler = {
    vph: () => $(window).innerHeight(),
    vpw: () => $(window).innerWidth(),
    headerHeight: () => $('header').height(),
    breakPoint: function () {
      return this.vpw() < 790 ? true : false;
    }
  }

  // to handle header stuff
  const headerHandler = {
    // handle the header name stuff
    name: {
      $h1: $('h1'),
      finalSize: 1.7,
      startSize: 4,
      currentSize: 4,
      startTop: 20,
      finalTop: 5,
      currentTop: 20,
      // on scroll
      scroll: function (scrollTop) {
        if (sizeHandler.breakPoint()) {
          this.startSize = 3;
          this.finalTop = 10;
          this.startTop = 120;

        } else {
          this.startSize = 4;
          this.finalTop = 5;
          this.startTop = 20;
        }
        // if its still showing the header
        if (scrollTop < sizeHandler.headerHeight()) {

          // set the current size of the h1 based on how much the page is scrolled
          this.currentSize = (this.startSize - ((this.startSize - this.finalSize) / sizeHandler.headerHeight()) * scrollTop) || this.startSize;
          this.currentTop = (this.startTop - ((this.startTop - this.finalTop) / sizeHandler.headerHeight()) * scrollTop);
          // if its not still showing the header
        } else {
          // size and margin are the end size and margin
          this.currentSize = this.finalSize;
          this.currentTop = this.finalTop;
        }
        // set the css values
        this.$h1.css({
          fontSize: this.currentSize + 'em',
          top: this.currentTop + 'px'
        });
      }
    },
    // handle the nav stuff
    nav: {
      $nav: $('nav.desktop'),
      groups: [
        {
          $group: $('.nav-group').first(),
          startOffset: function () {
            return ($('nav.desktop').width() / 2) - this.$group.width() - 15;
          },
          side: 'left'
        },
        {
          $group: $('.nav-group').last(),
          startOffset: function () {
            return ($('nav.desktop').width() / 2) - this.$group.width() - 15;
          },
          side: 'right'
        }
      ],
      fixed: false,
      // on scroll
      scroll: function (scrollTop) {
        // if its not fixed and it should be
        if (scrollTop >= sizeHandler.headerHeight() && !this.fixed) {
          // fix it
          this.fixed = true;
          this.$nav.css({
            position: 'fixed',
            top: '0'
          });
          // stops bouncing on mobile
          $(window).scrollTop(scrollTop + 5);
          // if it is fixed and it shouldn't be
        } else if (scrollTop < sizeHandler.headerHeight() && this.fixed) {
          // unfix it
          this.fixed = false;
          this.$nav.css({
            position: 'absolute',
            top: 'auto'
          });

        }
        if (scrollTop < sizeHandler.headerHeight()) {
          this.groups.forEach(function (group) {
            const currentOffset = group.startOffset() - (group.startOffset() / sizeHandler.headerHeight() * scrollTop);
            group.$group.css(group.side, currentOffset + 'px');
          });
        }
      }
    }
  }



  // project slide in and out
  const projectHandler = {
    $projectContents: $('.project-content'),
    showing: [true, true, true],
    // on scroll
    scroll: function (scrollTop) {
      const self = this;
      // for each of the project contents
      this.$projectContents.each(function (i, $project) {
        // default side is left
        let side = 'left';
        // get width, top, and bottom
        const width = $($project).width();
        const top = $($project).parent().offset().top;
        const bottom = top + $($project).parent().height();
        // if it is even
        if (i % 2 !== 0) {
          // its on the right
          side = 'right';
        }
        // if its within the view and not showing
        if (scrollTop + (sizeHandler.vph() / 2) > top && !self.showing[i] && !(scrollTop > bottom + 100)) {
          // set the css
          $($project).css('margin-' + side, 0);
          self.showing[i] = true;

          // if its out of the view and showing
        } else if (scrollTop + (sizeHandler.vph() / 2) <= top && self.showing[i]) {
          // set the css
          $($project).css('margin-' + side, -width - 40 + 'px');
          self.showing[i] = false;

          // if its out of the view the other way and showing
        } else if (scrollTop > bottom + 100 && self.showing[i]) {
          // set the css
          $($project).css('margin-' + side, -width - 40 + 'px');
          self.showing[i] = false;
        }
      })
    }
  }



  headerHandler.nav.scroll(0);


})

