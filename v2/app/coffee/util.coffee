define []
, ->
	util = 
		platformInfo:
			isChrome: yes
			isFirefox: no
			
		canvas: (size, styles) ->
			canvas = document.createElement 'canvas'
			canvas.width = size.width
			canvas.height = size.height

			@apply canvas.style, styles
			@setImageRendering canvas
			canvas

		apply: (dest, src) ->
			for own key, value of src
				dest[key] = value
			dest

		setImageRendering: (el) ->
			rendering = 'optimizeSpeed'
			if @platformInfo.isChrome
				rendering = '-webkit-optimize-contrast'
			else if @platformInfo.isFirefox
				rendering = '-moz-crisp-edges'

			el.style.imageRendering = rendering
			el



