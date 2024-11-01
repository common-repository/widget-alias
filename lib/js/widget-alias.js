(function( $ ) {

	var aliasCount = {},
		widget_id_base = 'widget-alias',
		sidebar = '#widgets-right',
		widget_selector = '.widget[id*="widget-alias"]';

	$(document).ajaxSuccess(function(e, xhr, settings) {

		// Reset aliasCount[] array
		aliasCount = {};

		// Only proceed if there is data
		if ( ! settings.data ) {
			return false;
		}

		// Save all widget-alias widgets when others are updated/added/removed/re-ordered/etc
		if ( ( -1 != settings.data.search( 'action=save-widget' ) || -1 != settings.data.search( 'action=widgets-order' ) ) ) {

			$(sidebar).find(widget_selector).each(function() {

				var selector = $(this);
				var n = selector.find('input.multi_number').val();
				var id = selector.attr('id');

				// Save/update all Widget Alias widgets to show current widgets
				if ( -1 == settings.data.search('id_base=' + widget_id_base) ) {
					selector.attr( 'id', id.replace('__i__', n) );
					wpWidgets.save( selector, 0, 1, 0 );
				}

			});

			addAliasCount();

		}

		// Add ID's to newly added widgets
		if( -1 != settings.data.search( 'add_new' ) ) {
			addIDs();
		}

	});

	// Add IDs and alias count to existing widgets - widgets page.
	jQuery( function( $ ) {

		// Add IDs to widgets, set timeout to enable in customizer.
		setTimeout( addIDs, 10 );

		// Add Alias Count where needed
		addAliasCount();

	} );

	// Add ID's and aliased count below widget-title in admin
	function addIDs() {

		$('#widgets-right .widget').each(function() {

			var widget = $(this);
			var id = widget.find('input[name="widget-id"]').val();

			// Only add widget ID if it's not already there
			if ( 1 > widget.find('.wa-info').length ) {
				widget.find('.widget-top').after('<div class="wa-info wp-ui-highlight highlight">#' + id + '</div>');
			}

		});

	}

	// Update aliasCount[]
	function addAliasCount() {

		// Get alias count for all widgets
		$(sidebar).find(widget_selector).each(function() {

			var selector = $(this);
			var option = selector.find('option:selected').val();

			if ( !aliasCount[option] ) {
				aliasCount[ option] = 1;
			}
			else {
				aliasCount[option]++;
			}

		});

		// Refresh alias count
		$('.alias-count').remove();

		// Update alias count text on aliased widgets
		$.each(aliasCount, function( widgetID, count ) {
			$('.widget[id*="' + widgetID + '"]').find('.widget-control-actions').after('<div class="alias-count">This widget is aliased ' + count + ' ' + ( 1 == count ? 'time' : 'times' ) + '</div>' );
		});

	}

})(jQuery);