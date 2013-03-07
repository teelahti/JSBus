// Visualize given values on page
var DataBar = (function () {
    function DataBar(root, caption) {
        if (!root) {
            throw new Error("Must give DOM root for bar graph");
        }

        this.root = root;
        this._value = 0;
        this.valueDisplay = document.createElement("span");

        // Create initial DOM elements
        var box = document.createElement("div");

        box.innerText = caption;
        box.appendChild(this.valueDisplay);

        root.appendChild(box);
    }

    Object.defineProperty(DataBar.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._value = val;

            // TODO: Update chart
            this.valueDisplay.innerHTML = val;
        },
        enumerable: true,
        configurable: true
    });

    return DataBar;
})();

