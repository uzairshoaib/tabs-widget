(function() {
	var tabPanel = function($li) {
		var selector = $li.find('a').attr('href');
		return $(selector);
	};
	$.fn.tabs = function(){
		$.each(this, function(i, ul){
			var $ul = $([ul]);
			var $activeLi;
			$.each($ul.children(), function(j, li){
				var $li = $([li]);
				if(j == 0) {
					$activeLi = $li;
				} else {
					var $div = tabPanel($li);
					$div.hide();
				}
			});
			$ul.children().bind('click',function(ev){
				ev.preventDefault();
				tabPanel($activeLi).hide();
				$activeLi = $([this]);
				tabPanel($activeLi).show();
			});
		});
	}
	$('#my-tabs').tabs();
})();