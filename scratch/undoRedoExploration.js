
_onMouseDown: function(e) {
	// trim all undoRedo states that are beyond the current state
	this._trimUndoRedoStates();

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

	this._undoRedoStates.push(new UndoRedoState({
		boundingBox: this.currentBoundingBox.boundingBox,
		undoClip: Clip.create(canvas, this.currentBoundingBox.boundingBox),
		redoClip: Clip.create(scratch, this.currentBoundingBox.boundingBox)
	});

	this.currentBoundingBox = null;
};

_onUndo: function() {
	if(this._currentUndoRedoStateIndex > 0) {
		this._currentUndoRedoStateIndex -= 1;

		var state = this._undoRedoStates[this._currentUndoRedoStateIndex];

		this._applyClip(state.undoClip, state.boundingBox);
	}
};

_onRedo: function() {
	if(this._currentUndoRedoStateIndex < this._undoRedoStates - 1) {
		this._currentUndoRedoStateIndex += 1;

		var state = this._undoRedoState[this._currentUndoRedoStateIndex];

		this._applyClip(state.redoClip, state.boundingBox);
	}
};
