$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});

function openGrid() {
    addMask();
    $("html").scrollTop(0);
    $('#avatarChoice').show();
    $('#avatarChoice').css({"display":"flex", "justify-content":"center"});
    $('#avatarChoice').empty();
    $('#avatarChoice').prepend("<p>Choose your avatar!</p>");

    for (i=1;i<20;i++) {
        $('#avatarChoice').append("<img id='avatar"+i+"' src='../../images/avatars/"+i+".png'>");
    }

    $('#avatarChoice img').click(function () {
        let src = $(this).attr('src');
        $('#avaThumb').attr('src', src);
        $('#avatarChoice').hide();
        $('#mask').remove();

        $('html, body').animate({
            scrollTop: $("#avaThumb").offset().top
        }, 500);
    });
}

function addMask() {
    $('html').append("<div id='mask'></div>");
    $('#mask').css({"position":"fixed", "top":"0", "left":"0", "width":"100vw", "height":"100vh", "background-color":"rgba(0,0,0,0.8)"});
}
