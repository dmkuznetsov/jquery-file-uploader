
jQuery.extend({

	handleError: function( s, data, status, err ) {
		if ( s.error ) {
			s.error( data, status, err );
		};
	},

    createUploadIframe: function( id, uri )
	{
            var frameId = 'jUploadFrame' + id;
            var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
			if ( window.ActiveXObject )
			{
                if ( typeof uri == 'boolean' ) {
					iframeHtml += ' src="' + 'javascript:false' + '"';

                }
                else if ( typeof uri== 'string'){
					iframeHtml += ' src="' + uri + '"';

                }
			}
			iframeHtml += ' />';
			jQuery( iframeHtml ).appendTo( document.body );

            return jQuery( '#' + frameId ).get( 0 );
    }

    , createUploadForm: function( id, fileElementId, data )
	{
		var formId = 'jUploadForm' + id;
		var fileId = 'jUploadFile' + id;
		var form = jQuery( '<form action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>' );
		if( data ) {
			for( var i in data ) {
				jQuery( '<input type="hidden" name="' + i + '" value="' + data[i] + '" />' ).appendTo( form );
			};
		};
		var oldElement = jQuery( '#' + fileElementId );
		var newElement = jQuery( oldElement ).clone();
		jQuery( oldElement ).attr( 'id', fileId );
		jQuery( oldElement ).before( newElement );
		jQuery( oldElement ).appendTo( form );

		jQuery( form ).css( 'position', 'absolute' );
		jQuery( form ).css( 'top', '-1200px' );
		jQuery( form ).css( 'left', '-1200px' );
		jQuery( form ).appendTo( 'body' );
		return form;
    }

    , ajaxFileUpload: function( s ) {
    	s = jQuery.extend( {}, jQuery.ajaxSettings, s );
    	var id = new Date().getTime()
    		, form = jQuery.createUploadForm( id, s.fileElementId, ( typeof( s.data ) == 'undefined' ? false : s.data ) )
    		, io = jQuery.createUploadIframe( id, s.secureuri )
    		, frameId = 'jUploadFrame' + id
    		, formId = 'jUploadForm' + id
    		, requestDone = false;

		var uploadCallback = function ( isTimeout ) {
			var io = document.getElementById( frameId )
				, data = null;

			try {
				if ( io.contentWindow ) {
					data = io.contentWindow.document.body ? io.contentWindow.document.body.innerText : null;
				} else if ( io.contentDocument ) {
					data = io.contentDocument.document.body ? io.contentDocument.document.body.innerText : null;
				};
			} catch ( err ) {
				jQuery.handleError( s, data, null, err );
			};

			if ( data || isTimeout == "timeout" ) {
				requestDone = true;
				var status;

				try {
					status = isTimeout != "timeout" ? "success" : "error";
	                if ( status != "error" )
					{
	                    data = jQuery.parseJSON( data );

						if ( s.success ) {
	                        s.success( data, status );
	                    };
	                } else {
						jQuery.handleError( s, data, status, null );
					};

					if ( s.complete ) {
						s.complete( data, status );
					};
				} catch ( err ) {
					jQuery.handleError( s, data, null, err );
				}

				jQuery( io ).unbind();

                setTimeout( function() {
                	try {
                		jQuery(io).remove();
						jQuery(form).remove();
					} catch( err ) {
						jQuery.handleError( s, data, null, null );
					};
				}, 100 );
			};
			data = null;
		};

        // Timeout checker
        if ( s.timeout > 0 ) 
		{
            setTimeout( function() {
                if( !requestDone ) {
                	uploadCallback( "timeout" );
                };
            }, s.timeout );
        }

        try
		{
			var form = jQuery( '#' + formId );
			jQuery( form ).attr( 'action', s.url );
			jQuery( form ).attr( 'method', 'POST' );
			jQuery( form ).attr( 'target', frameId );
            if( form.encoding ) {
				jQuery( form ).attr( 'encoding', 'multipart/form-data' );
            } else {	
				jQuery( form ).attr( 'enctype', 'multipart/form-data' );
            };
            jQuery( form ).submit();
        } catch( err ) {
            jQuery.handleError( s, data, status, err );
        }
		
		jQuery( '#' + frameId ).load( uploadCallback );

		// @todo: add abort function
        return { abort: function () {} };	
    }
});
