

_onMouseDown: function(e) {
	var currentPoint = transform(e.x, e.y);
	this.currentBoundingBox = new BoundingBoxBuilder(tool.getBoundsAt(currentPoint));

	tool.perform(scratch, currentPoint);
	tool.overlay(overlay, currentPoint);
};

_onMouseMove: function(e) {
	var currentPoint = transform(e.x, e.y);

	this.currentBoundingBox.append(tool.getBoundsAt(currentPoint));

	tool.perform(scratch, currentPoint);
	tool.overlay(overlay, currentPoint);
};

_onMouseUp: function(e) {
	var currentPoint = transform(e.x, e.y);

	this.currentBoundingBox.seal(tool.getBoundsAt(currentPoint));
	this._undoClips.push(Clip.create(canvas, currentBoundingBox.boundingBox));
};

_onUndo: function() {
	var clip = this._undoClips.pop();

	if(action) {
		this._applyClip(clip);
	};

};
