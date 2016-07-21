(function(pkg, Class) {

/**
 * Layout package provides number of classes, interfaces, methods and
 * variables that allows developer easily implement rules based layouting
 * of hierarchy of rectangular elements. The package has no relation
 * to any concrete UI, but it can be applied to a required UI framework
 *
 * @module layout
 * @main layout
 */

 /**
  * Find a direct children element for the given children component
  * and the specified parent component
  * @param  {zebkit.layout.Layoutable} parent  a parent component
  * @param  {zebkit.layout.Layoutable} child  a children component
  * @return {zebkit.layout.Layoutable}  a direct children component
  * @method getDirectChild
  * @for zebkit.layout
  */
pkg.getDirectChild = function(parent, child){
    for(; child != null && child.parent !== parent; child = child.parent) {}
    return child;
};

/**
 * Layout manager interface
 * @class zebkit.layout.Layout
 * @interface
 */

/**
 * Calculate preferred size of the given component
 * @param {zebkit.layout.Layoutable} t a target layoutable component
 * @method calcPreferredSize
 */

/**
 * Layout children components of the specified layoutable target component
 * @param {zebkit.layout.Layoutable} t a target layoutable component
 * @method doLayout
 */
pkg.Layout = new zebkit.Interface({
    abstract: [
        function doLayout(target) {},
        function calcPreferredSize(target) {}
    ]
});

/**
 * Find a direct component located at the given location of the specified
 * parent component and the specified parent component
 * @param  {Integer} x a x coordinate relatively to the parent component
 * @param  {Integer} y a y coordinate relatively to the parent component
 * @param  {zebkit.layout.Layoutable} parent  a parent component
 * @return {zebkit.layout.Layoutable} an index of direct children component
 * or -1 if no a children component can be found
 * @method getDirectAt
 * @api zebkit.layout.getDirectAt()
 */
pkg.getDirectAt = function(x,y,p){
    for(var i = 0;i < p.kids.length; i++){
        var c = p.kids[i];
        if (c.isVisible === true && c.x <= x && c.y <= y && c.x + c.width > x && c.y + c.height > y) {
            return i;
        }
    }
    return -1;
};

/**
 * Get a top (the highest in component hierarchy) parent component
 * of the given component
 * @param  {zebkit.layout.Layoutable} c a component
 * @return {zebkit.layout.Layoutable}  a top parent component
 * @method getTopParent
 * @api zebkit.layout.getTopParent()
 */
pkg.getTopParent = function(c){
    for(; c != null && c.parent != null; c = c.parent);
    return c;
};

/**
 * Translate the given relative location into the parent relative location.
 * @param  {Integer} [x] a x coordinate relatively  to the given component
 * @param  {Integer} [y] a y coordinate relatively  to the given component
 * @param  {zebkit.layout.Layoutable} c a component
 * @param  {zebkit.layout.Layoutable} [p] a parent component
 * @return {Object} a relative to the given parent UI component location:

        { x:{Integer}, y:{Integer} }

 * @method toParentOrigin
 * @api zebkit.layout.toParentOrigin()
 */
pkg.toParentOrigin = function(x,y,c,p){
    if (arguments.length === 1) {
        c = x;
        x = y = 0;
        p = null;
    }
    else {
        if (arguments.length < 4) p = null;
    }

    while (c !== p) {
        x += c.x;
        y += c.y;
        c = c.parent;
    }
    return { x:x, y:y };
};

/**
 * Convert the given component location into relative
 * location of the specified children component successor.
 * @param  {Integer} x a x coordinate relatively to the given
 * component
 * @param  {Integer} y a y coordinate relatively to the given
 * component
 * @param  {zebkit.layout.Layoutable} p a component
 * @param  {zebkit.layout.Layoutable} c a children successor component
 * @return {Object} a relative location
 *
 *      { x:{Integer}, y:{Integer} }
 *
 * @method toChildOrigin
 * @api zebkit.layout.toChildOrigin()
 */
pkg.toChildOrigin = function(x, y, p, c){
    while(c !== p){
        x -= c.x;
        y -= c.y;
        c = c.parent;
    }
    return { x:x, y:y };
};

/**
 * Calculate maximal preferred width and height of
 * children component of the given target component.
 * @param  {zebkit.layout.Layoutable} target a target component
 * @return {Object} a maximal preferred width and height

        { width:{Integer}, height:{Integer} }

 * @method getMaxPreferredSize
 * @api zebkit.layout.getMaxPreferredSize()
 */
pkg.getMaxPreferredSize = function(target) {
    var maxWidth = 0, maxHeight = 0;
    for(var i = 0;i < target.kids.length; i++){
        var l = target.kids[i];
        if (l.isVisible === true){
            var ps = l.getPreferredSize();
            if (ps.width > maxWidth) maxWidth = ps.width;
            if (ps.height > maxHeight) maxHeight = ps.height;
        }
    }
    return { width:maxWidth, height:maxHeight };
};

pkg.isAncestorOf = function(p, c){
    for(; c != null && c !== p; c = c.parent);
    return c != null;
};

/**
 * Layoutable class defines rectangular component that
 * has elementary metrical properties like width, height
 * and location and can be a participant of layout management
 * process. Layoutable component is container that can
 * contains other layoutable component as its children.
 * The children components are ordered by applying a layout
 * manager of its parent component.
 * @class zebkit.layout.Layoutable
 * @constructor
 * @extends {zebkit.layout.Layout}
 */
pkg.Layoutable = Class(pkg.Layout, [
    function $prototype() {
        /**
         * x coordinate
         * @attribute x
         * @default 0
         * @readOnly
         * @type {Integer}
         */

        /**
        * y coordinate
        * @attribute y
        * @default 0
        * @readOnly
        * @type {Integer}
        */

        /**
        * Width of rectangular area
        * @attribute width
        * @default 0
        * @readOnly
        * @type {Integer}
        */

        /**
        * Height of rectangular area
        * @attribute height
        * @default 0
        * @readOnly
        * @type {Integer}
        */

        /**
        * Indicate a layoutable component visibility
        * @attribute isVisible
        * @default true
        * @readOnly
        * @type {Boolean}
        */

        /**
        * Indicate a layoutable component validity
        * @attribute isValid
        * @default false
        * @readOnly
        * @type {Boolean}
        */

        /**
        * Reference to a parent layoutable component
        * @attribute parent
        * @default null
        * @readOnly
        * @type {zebkit.layout.Layoutable}
        */

        this.x = this.y = this.height = this.width = this.cachedHeight= 0;

        this.psWidth = this.psHeight = this.cachedWidth = -1;
        this.isLayoutValid = this.isValid = false;

        /**
         * The component layout constraints. The constraints is specific to
         * the parent component layout manager value that customizes the
         * children component layouting on the parent component.
         * @attribute constraints
         * @default null
         * @type {Object}
         */
        this.constraints = this.parent = null;
        this.isVisible = true;

        function $normPath(p) {
            p = p.trim();
            if (p[0] === '/') return p;
            if (p[0] === '#') return "//*[@id='" + p.substring(1).trim() + "']";
            return "//" + (p[0] === '.' ? p.substring(1).trim() : p);
        }

        /**
         * Find a first children component that satisfies the passed path expression.
         * @param  {String} path path expression. Path expression is simplified form
         * of XPath-like expression:

        "/Panel"  - find first children that is an instance of zebkit.ui.Panel
        "/Panel[@id='top']" - find first children that is an instance of zebkit.ui.Panel with "id" property that equals "top"
        "//Panel"  - find first children that is an instance of zebkit.ui.Panel recursively

         * Shortcuts:

            "#id" - find a component by its "id" attribute value. This is equivalent of "//*[@id='a component id property']" path
            "zebkit.ui.Button" - find a component by its class.  This is equivalent of "//className" path

         *
         * @method find
         * @return {zebkit.layout.Layoutable} found children component or null if
         * no children component can be found
         */
        this.find = function(path){
            var res = null;
            zebkit.util.findInTree(this, $normPath(path),
                function(node, name) {
                    return node.clazz != null && zebkit.instanceOf(node, zebkit.Class.forName(name));
                },

                function(kid) {
                   res = kid;
                   return true;
            });
            return res;
        };

        /**
         * Find children components that satisfy the passed path expression.
         * @param  {String} path path expression. Path expression is
         * simplified form of XPath-like expression:

         "/Panel"  - find first children that is an instance of zebkit.ui.Panel
         "/Panel[@id='top']" - find first children that is an instance of zebkit.ui.Panel with "id" property that equals "top"
         "//Panel"  - find first children that is an instance of zebkit.ui.Panel recursively

         * Shortcuts:

            "#id" - find a component by its "id" attribute value. This is equivalent of "//*[@id='a component id property']" path
            "zebkit.ui.Button" - find a component by its class.  This is equivalent of "//className" path

         * @param {Function} [callback] function that is called every time a
         * new children component has been found.
         * @method findAll
         * @return {Array}  return array of found children components if
         * passed function has not been passed
         */
        this.findAll = function(path, callback){
            var res = [];
            if (callback == null) {
                callback =  function(kid) {
                    res.push(kid);
                    return false;
                };
            }

            zebkit.util.findInTree(this, $normPath(path),
                function(node, name) {
                    return node.clazz != null && zebkit.instanceOf(node, zebkit.Class.forName(name));
                }, callback);
            return res;
        };

        /**
         * Set the given id for the component
         * @chainable
         * @param {String} id an ID to be set
         * @method setId
         */
        this.setId = function(id) {
            this.id = id;
            return this;
        };

        /**
         * Apply the given set of properties to the given component or a number of children
         * components.

        var c = new zebkit.layout.Layoutable();
        c.properties({
            width: [100, 100],
            location: [10,10],
            layout: new zebkit.layout.BorderLayout()
        })

        c.add(new zebkit.layout.Layoutable()).add(zebkit.layout.Layoutable()).add(zebkit.layout.Layoutable());
        c.properties("//*", {
            size: [100, 200]
        });


         *
         * @param  {String} [path]  a path to find children components
         * @param  {Object} props a dictionary of properties to be applied
         * @return {zebkit.ui.Layoutable} a component itself
         * @chainable
         * @method properties
         */
        this.properties = function(path, props) {
            if (arguments.length === 1) {
                return zebkit.properties(this, path);
            }

            this.findAll(path, function(kid) {
                zebkit.properties(kid, props);
            });
            return this;
        };

        /**
         * Set the given property to the component or children component
         * specified by the given selector
         * @param  {String} [path]  a path to find children components
         * @param  {String} name a property name
         * @param  {object} value a property value
         * @chainable
         * @method property
         */
        this.property = function() {
            var p = {};
            if (arguments.length > 2) {
                p[arguments[1]] = arguments[2];
                return this.properties(arguments[0], p);
            }
            p[arguments[0]] = arguments[1];
            return this.properties(p);
        };

        /**
         * Validate the component metrics. The method is called as
         * a one step of the component validation procedure. The
         * method causes "recalc" method execution if the method
         * has been implemented and the component is in invalid
         * state. It is supposed the "recalc" method has to be
         * implemented by a component as safe place where the
         * component metrics can be calculated. Component
         * metrics is individual for the given component
         * properties that has influence to the component
         * preferred size value. In many cases the properties
         * calculation has to be minimized what can be done
         * by moving the calculation in "recalc" method
         * @method validateMetric
         * @protected
         */
        this.validateMetric = function(){
            if (this.isValid === false) {
                if (this.recalc != null) this.recalc();
                this.isValid = true;
            }
        };

        /**
         * By default there is no any implementation of "recalc" method
         * in the layoutable component. In other words the method doesn't
         * exist. Developer should implement the method if the need a proper
         * and efficient place  to calculate component properties that
         * have influence to the component preferred size. The "recalc"
         * method is called only when it is really necessary to compute
         * the component metrics.
         * @method recalc
         * @protected
         */

        /**
         * Invalidate the component layout. Layout invalidation means the
         * component children components have to be placed with the component
         * layout manager. Layout invalidation causes a parent component
         * layout is also invalidated.
         * @method invalidateLayout
         * @protected
         */
        this.invalidateLayout = function(){
            this.isLayoutValid = false;
            if (this.parent != null) this.parent.invalidateLayout();
        };

        /**
         * Invalidate component layout and metrics.
         * @method invalidate
         */
        this.invalidate = function(){
            this.isValid = this.isLayoutValid = false;
            this.cachedWidth =  -1;
            if (this.parent != null) this.parent.invalidate();
        };

        /**
         * Force validation of the component metrics and layout if it is not valid
         * @method validate
         */
        this.validate = function() {
            if (this.isValid === false) this.validateMetric();

            if (this.width > 0 && this.height > 0 &&
                this.isLayoutValid === false &&
                this.isVisible === true)
            {
                this.layout.doLayout(this);
                for(var i = 0;i < this.kids.length; i++) {
                    this.kids[i].validate();
                }
                this.isLayoutValid = true;
                if (this.laidout != null) this.laidout();
            }
        };

        /**
         * The method can be implemented to be informed every time
         * the component has completed to layout its children components
         * @method laidout
         */

        /**
         * Get preferred size. The preferred size includes  top, left,
         * bottom and right paddings and
         * the size the component wants to have
         * @method getPreferredSize
         * @return {Object} return size object the component wants to
         * have as the following structure:

         {width:{Integer}, height:{Integer}} object

         */
        this.getPreferredSize = function(){
            this.validateMetric();

            if (this.cachedWidth < 0) {
                var ps = (this.psWidth < 0 || this.psHeight < 0) ? this.layout.calcPreferredSize(this)
                                                                 : { width:0, height:0 };

                ps.width  = this.psWidth  >= 0 ? this.psWidth
                                               : ps.width  + this.getLeft() + this.getRight();
                ps.height = this.psHeight >= 0 ? this.psHeight
                                               : ps.height + this.getTop()  + this.getBottom();
                this.cachedWidth  = ps.width;
                this.cachedHeight = ps.height;
                return ps;
            }
            return { width:this.cachedWidth,
                     height:this.cachedHeight };
        };

        /**
         * Get top padding.
         * @method getTop
         * @return {Integer} top padding in pixel
         */
        this.getTop = function ()  { return 0; };

        /**
         * Get left padding.
         * @method getLeft
         * @return {Integer} left padding in pixel
         */
        this.getLeft = function ()  { return 0; };

        /**
         * Get bottom padding.
         * @method getBottom
         * @return {Integer} bottom padding in pixel
         */
        this.getBottom = function ()  { return 0; };

        /**
         * Get right padding.
         * @method getRight
         * @return {Integer} right padding in pixel
         */
        this.getRight = function ()  { return 0; };

        /**
         * Set the parent component.
         * @protected
         * @param {zebkit.layout.Layoutable} o a parent component
         * @method setParent
         * @protected
         */
        this.setParent = function (o){
            if (o != this.parent){
                this.parent = o;
                this.invalidate();
            }
        };

        /**
         * Set the given layout manager that is used to place
         * children component. Layout manager is simple class
         * that defines number of rules concerning the way
         * children components have to be ordered on its parent
         * surface.
         * @method setLayout
         * @param {zebkit.ui.Layout} m a layout manager
         * @chainable
         */
        this.setLayout = function (m){
            if (m == null) throw new Error("Null layout");

            if (this.layout != m){
                var pl = this.layout;
                this.layout = m;
                this.invalidate();
            }

            return this;
        };

        /**
         * Internal implementation of the component
         * preferred size calculation.
         * @param  {zebkit.layout.Layoutable} target a component
         * for that the metric has to be calculated
         * @return {Object} a preferred size. The method always
         * returns { width:10, height:10 } as the component preferred
         * size
         * @private
         * @method calcPreferredSize
         */
        this.calcPreferredSize = function (target){
            return { width:10, height:10 };
        };

        /**
         * By default layoutbable component itself implements
         * layout manager to order its children components.
         * This method implementation does nothing, so children
         * component will placed according locations and sizes they
         * have set.
         * @method doLayout
         * @private
         */
        this.doLayout = function (target) {};

        /**
         * Detect index of a children component.
         * @param  {zebkit.ui.Layoutbale} c a children component
         * @method indexOf
         * @return {Integer}
         */
        this.indexOf = function (c){
            return this.kids.indexOf(c);
        };

        /**
         * Insert the new children component at the given index with the specified layout constraints.
         * The passed constraints can be set via a layoutable component that is inserted. Just
         * set "constraints" property of in inserted component.
         * @param  {Integer} i an index at that the new children component has to be inserted
         * @param  {Object} constr layout constraints of the new children component
         * @param  {zebkit.layout.Layoutbale} d a new children layoutable component to be added
         * @return {zebkit.layout.Layoutable} an inserted children layoutable component
         * @method insert
         */
        this.insert = function(i,constr,d){
            if (d.constraints != null) constr = d.constraints;
            else                       d.constraints = constr;

            if (i === this.kids.length) this.kids.push(d);
            else this.kids.splice(i, 0, d);

            d.setParent(this);

            if (this.kidAdded != null) this.kidAdded(i, constr, d);
            this.invalidate();
            return d;
        };

        /**
         * The method can be implemented to be informed every time a new component
         * has been inserted into the component
         * @param  {Integer} i an index at that the new children component has been inserted
         * @param  {Object} constr layout constraints of the new children component
         * @param  {zebkit.layout.Layoutbale} d a new children layoutable component that has
         * been added
         * @method kidAdded
         */

        /**
         * Set the layoutable component location. Location is x, y coordinates relatively to
         * a parent component
         * @param  {Integer} xx x coordinate relatively to the layoutable component parent
         * @param  {Integer} yy y coordinate relatively to the layoutable component parent
         * @method setLocation
         */
        this.setLocation = function (xx,yy){
            if (xx != this.x || this.y != yy){
                var px = this.x, py = this.y;
                this.x = xx;
                this.y = yy;
                if (this.relocated != null) this.relocated(px, py);
            }
        };

        /**
         * The method can be implemented to be informed every time the component
         * has been moved
         * @param  {Integer} px x previous coordinate of moved children component
         * @param  {Integer} py y previous coordinate of moved children component
         * @method relocated
         */


        /**
         * Set the layoutable component bounds. Bounds defines the component location and size.
         * @param  {Integer} x x coordinate relatively to the layoutable component parent
         * @param  {Integer} y y coordinate relatively to the layoutable component parent
         * @param  {Integer} w a width of the component
         * @param  {Integer} h a height of the component
         * @method setBounds
         * @chainable
         */
        this.setBounds = function (x, y, w, h){
            this.setLocation(x, y);
            this.setSize(w, h);
            return this;
        };

        /**
         * Set the layoutable component size.
         * @param  {Integer} w a width of the component
         * @param  {Integer} h a height of the component
         * @method setSize
         */
        this.setSize = function (w,h){
            if (w != this.width || h != this.height){
                var pw = this.width, ph = this.height;
                this.width = w;
                this.height = h;
                this.isLayoutValid = false;
                if (this.resized != null) this.resized(pw, ph);
            }
            return this;
        };

        /**
         * The method can be implemented to be informed every time the component
         * has been resized
         * @param  {Integer} w a previous width of the component
         * @param  {Integer} h a previous height of the component
         * @method resized
         */

        /**
         * Get a children layoutable component by the given constraints.
         * @param  {zebkit.layout.Layoutable} c a constraints
         * @return {zebkit.layout.Layoutable} a children component
         * @method getByConstraints
         */
        this.getByConstraints = function (c) {
            if (this.kids.length > 0){
                for(var i = 0;i < this.kids.length; i++ ){
                    var l = this.kids[i];
                    if (c === l.constraints) return l;
                }
            }
            return null;
        };

        /**
         * Remove the given children component.
         * @param {zebkit.layout.Layoutable} c a children component to be removed
         * @method remove
         * @return {zebkit.layout.Layoutable} a removed children component
         */
        this.remove = function(c) {
            return this.removeAt(this.kids.indexOf(c));
        };

        /**
         * Remove a children component at the specified position.
         * @param {Integer} i a children component index at which it has to be removed
         * @method removeAt
         * @return {zebkit.layout.Layoutable} a removed children component
         */
        this.removeAt = function (i){
            var obj = this.kids[i];
            obj.setParent(null);
            if (obj.constraints != null) obj.constraints = null;
            this.kids.splice(i, 1);
            if (this.kidRemoved != null) this.kidRemoved(i, obj);
            this.invalidate();
            return obj;
        };

        /**
         * Remove the component from its parent if it has a parent
         * @method removeMe
         */
        this.removeMe = function() {
            var i = -1;
            if (this.parent != null && (i = this.parent.indexOf(this)) >=0) {
                this.parent.removeAt(i);
            }
        };

        /**
         * The method can be implemented to be informed every time a children component
         * has been removed
         * @param {Integer} i a children component index at which it has been removed
         * @param  {zebkit.layout.Layoutable} c a children component that has been removed
         * @method kidRemoved
         */

        /**
         * Set the specified preferred size the component has to have.
         * Component preferred size is important thing that is widely
         * used to layout the component. Usually the preferred
         * size is calculated by a concrete component basing on
         * its metrics. For instance, label component calculates its
         * preferred size basing on text size. But if it is required
         * the component preferred size can be fixed with the desired
         * value.
         * @param  {Integer} w a preferred width. Pass "-1" as the
         * argument value to not set preferred width
         * @param  {Integer} h a preferred height. Pass "-1" as the
         * argument value to not set preferred height
         * @method setPreferredSize
         */
        this.setPreferredSize = function(w,h) {
            if (w != this.psWidth || h != this.psHeight){
                this.psWidth  = w;
                this.psHeight = h;
                this.invalidate();
            }
        };

        /**
         * Replace a children component at the specified index
         * with the given new children component
         * @param  {Integer} i an index of a children component to be replaced
         * @param  {zebkit.layout.Layoutable} d a new children
         * @return {zebkit.layout.Layoutable} a previous component that has
         * been re-set with the new one
         * @method setAt
         */
        this.setAt = function(i, d) {
            var constr = this.kids[i].constraints,
                pd     = this.removeAt(i);
            if (d != null) this.insert(i, constr, d);
            return pd;
        };

        /**
         * Add the new children component with the given constraints
         * @param  {Object} constr a constraints of a new children component
         * @param  {zebkit.layout.Layoutable} d a new children component to
         * be added
         * @method add
         * @return {zebkit.layout.Layoutable} added layoutable component
         */
        this.add = function(constr,d) {
            return (arguments.length === 1) ? this.insert(this.kids.length, null, constr)
                                            : this.insert(this.kids.length, constr, d);
        };

        // speedup constructor execution
        this[''] = function() {
            /**
             *  Reference to children components
             *  @attribute kids
             *  @type {Array}
             *  @default empty array
             *  @readOnly
             */
            this.kids = [];

            /**
            * Layout manager that is used to order children layoutable components
            * @attribute layout
            * @default itself
            * @readOnly
            * @type {zebkit.layout.Layout}
            */
            this.layout = this;
        };
    }
]);

/**
 *  Layout manager implementation that places layoutbale components
 *  on top of each other stretching its to fill all available parent
 *  component space
 *  @class zebkit.layout.StackLayout
 *  @constructor
 */
pkg.StackLayout = Class(pkg.Layout, [
    function $prototype() {
        this.calcPreferredSize = function (target){
            return pkg.getMaxPreferredSize(target);
        };

        this.doLayout = function(t){
            var top  = t.getTop(),
                hh   = t.height - t.getBottom() - top,
                left = t.getLeft(),
                ww   = t.width - t.getRight() - left;

            for(var i = 0;i < t.kids.length; i++){
                var l = t.kids[i];
                if (l.isVisible === true) {
                    var ctr = l.constraints == null ? null : l.constraints;

                    if (ctr === "usePsSize") {
                        var ps = l.getPreferredSize();
                        l.setBounds(left + Math.floor((ww - ps.width )/2),
                                    top  + Math.floor((hh - ps.height)/2),
                                    ps.width, ps.height);
                    }
                    else {
                        l.setBounds(left, top, ww, hh);
                    }
                }
            }
        };
    }
]);

/**
 *  Layout manager implementation that logically splits component area into five areas: top, bottom, left, right and center.
 *  Top and bottom components are stretched to fill all available space horizontally and are sized to have preferred height horizontally.
 *  Left and right components are stretched to fill all available space vertically and are sized to have preferred width vertically.
 *  Center component is stretched to occupy all available space taking in account top, left, right and bottom components.

       // create panel with border layout
       var p = new zebkit.ui.Panel(new zebkit.layout.BorderLayout());

       // add children UI components with top, center and left constraints
       p.add("top",    new zebkit.ui.Label("Top"));
       p.add("center", new zebkit.ui.Label("Center"));
       p.add("left",   new zebkit.ui.Label("Left"));

 * Construct the layout with the given vertical and horizontal gaps.
 * @param  {Integer} [hgap] horizontal gap. The gap is a horizontal distance between laid out components
 * @param  {Integer} [vgap] vertical gap. The gap is a vertical distance between laid out components
 * @constructor
 * @class zebkit.layout.BorderLayout
 * @extends {zebkit.layout.Layout}
 */
pkg.BorderLayout = Class(pkg.Layout, [
    function $prototype() {
        /**
         * Horizontal gap (space between components)
         * @attribute hgap
         * @default 0
         * @readOnly
         * @type {Integer}
         */

        /**
         * Vertical gap (space between components)
         * @attribute vgap
         * @default 0
         * @readOnly
         * @type {Integer}
         */
        this.hgap = this.vgap = 0;

        this[''] = function(hgap,vgap){
            if (arguments.length > 0) {
                this.hgap = this.vgap = hgap;
                if (arguments.length > 1) {
                    this.vgap = vgap;
                }
            }
        };

        this.calcPreferredSize = function (target){
            var center = null, left = null,  right = null, top = null, bottom = null, topRight = null, d = null;
            for(var i = 0; i < target.kids.length; i++){
                var l = target.kids[i];
                if (l.isVisible === true){
                    switch(l.constraints) {
                       case null:
                       case undefined:
                       case "center"    : center = l; break;
                       case "top"       : top    = l; break;
                       case "bottom"    : bottom = l; break;
                       case "left"      : left   = l; break;
                       case "right"     : right  = l; break;
                       default: throw new Error("Invalid constraints: " + l.constraints);
                    }
                }
            }

            var dim = { width:0, height:0 };
            if (right !== null) {
                d = right.getPreferredSize();
                dim.width  = d.width + this.hgap;
                dim.height = (d.height > dim.height ? d.height: dim.height );
            }

            if (left !== null) {
                d = left.getPreferredSize();
                dim.width += d.width + this.hgap;
                dim.height = d.height > dim.height ? d.height : dim.height;
            }

            if (center != null) {
                d = center.getPreferredSize();
                dim.width += d.width;
                dim.height = d.height > dim.height ? d.height : dim.height;
            }

            if (top != null) {
                d = top.getPreferredSize();
                dim.width = d.width > dim.width ? d.width : dim.width;
                dim.height += d.height + this.vgap;
            }

            if (bottom != null) {
                d = bottom.getPreferredSize();
                dim.width = d.width > dim.width ? d.width : dim.width;
                dim.height += d.height + this.vgap;
            }
            return dim;
        };

        this.doLayout = function(target){
            var t      = target.getTop(),
                b      = target.height - target.getBottom(),
                l      = target.getLeft(),
                r      = target.width - target.getRight(),
                center = null,
                left   = null,
                top    = null,
                bottom = null,
                right  = null;

            for(var i = 0;i < target.kids.length; i++){
                var kid = target.kids[i];
                if (kid.isVisible === true) {
                    switch(kid.constraints) {
                        case null:
                        case undefined:
                        case "center":
                            if (center != null) {
                                throw new Error("Component with center constraints is already defined");
                            }
                            center = kid;
                            break;
                        case "top" :
                            if (top != null) {
                                throw new Error("Component with top constraints is already defined");
                            }
                            var ps = kid.getPreferredSize();
                            kid.setBounds(l, t, r - l, ps.height);
                            t += ps.height + this.vgap;
                            top = kid;
                            break;
                        case "bottom":
                            if (bottom != null) {
                                throw new Error("Component with bottom constraints is already defined");
                            }
                            var ps = kid.getPreferredSize();
                            kid.setBounds(l, b - ps.height, r - l, ps.height);
                            b -= ps.height + this.vgap;
                            bottom = kid;
                            break;
                        case "left":
                            if (left != null) {
                                throw new Error("Component with left constraints is already defined");
                            }
                            left = kid;
                            break;
                        case "right":
                            if (right != null) {
                                throw new Error("Component with right constraints is already defined");
                            }
                            right = kid;
                            break;
                        default: throw new Error("Invalid constraints: " + kid.constraints);
                    }
                }
            }

            if (right != null){
                var d = right.getPreferredSize();
                right.setBounds(r - d.width, t, d.width, b - t);
                r -= d.width + this.hgap;
            }

            if (left != null){
                var d = left.getPreferredSize();
                left.setBounds(l, t, d.width, b - t);
                l += d.width + this.hgap;
            }

            if (center != null){
                center.setBounds(l, t, r - l, b - t);
            }
        };
    }
]);

/**
 * Rester layout manager can be used to use absolute position of
 * layoutable components. That means all components will be laid
 * out according coordinates and size they have. Raster layout manager
 * provides extra possibilities to control children components placing.
 * It is possible to align components by specifying layout constraints,
 * size component to its preferred size and so on.
 * @param {Boolean} [usePsSize] flag to add extra rule to set
 * components size to its preferred sizes.
 * @class  zebkit.layout.RasterLayout
 * @constructor
 * @extends {zebkit.layout.Layout}
 */
pkg.RasterLayout = Class(pkg.Layout, [
    function $prototype() {
        this.usePsSize = false;

        this.calcPreferredSize = function(c){
            var m = { width:0, height:0 };

            for(var i = 0;i < c.kids.length; i++ ){
                var kid = c.kids[i];
                if (kid.isVisible === true) {
                    var ps = this.usePsSize ? kid.getPreferredSize()
                                            : { width:kid.width, height:kid.height },
                        px = kid.x + ps.width,
                        py = kid.y + ps.height;

                    if (px > m.width)  m.width  = px;
                    if (py > m.height) m.height = py;
                }
            }
            return m;
        };

        this.doLayout = function(c) {
            var r = c.width - c.getRight(),
                b = c.height - c.getBottom();

            for(var i = 0;i < c.kids.length; i++){
                var kid = c.kids[i], ww = 0, hh = 0;

                if (kid.isVisible === true){
                    if (this.usePsSize) {
                        var ps = kid.toPreferredSize();
                        ww = ps.width;
                        hh = ps.height;
                    }
                    else {
                        ww = kid.width;
                        hh = kid.height;
                    }

                    var ctr = kid.constraints == null ? null : kid.constraints;
                    if (ctr != null) {
                        var x = kid.x, y = kid.y, size = null;

                        if (ctr === "top" || ctr === "topRight" || ctr === "topLeft") {
                            y = 0;
                        }
                        else if (ctr === "bottom" || ctr === "bottomLeft" || ctr === "bottomRight") {
                            y = c.height - hh;
                        }
                        else if (ctr === "center" || ctr === "left" || ctr === "right") {
                            y = Math.floor((c.height - hh) / 2);
                        }

                        if (ctr === "left" || ctr === "topLeft" || ctr === "bottomLeft") {
                            x = 0;
                        }
                        else if (ctr === "right" || ctr === "topRight" || ctr === "bottomRight") {
                            x = c.width - ww;
                        }
                        else if (ctr === "center" || ctr === "top" || ctr === "bottom") {
                            x = Math.floor((c.width  - ww) / 2);
                        }

                        kid.setLocation(x, y);
                    }
                }
            }
        };

        this[''] = function(ups) {
            if (arguments.length > 0) {
                this.usePsSize = ups;
            }
        };
    }
]);

/**
 * Flow layout manager group and places components aligned with
 * different vertical and horizontal alignments

        // create panel and set flow layout for it
        // components added to the panel will be placed
        // horizontally aligned at the center of the panel
        var p = new zebkit.ui.Panel();
        p.setLayout(new zebkit.layout.FlowLayout("center", "center"));

        // add three buttons into the panel with flow layout
        p.add(new zebkit.ui.Button("Button 1"));
        p.add(new zebkit.ui.Button("Button 2"));
        p.add(new zebkit.ui.Button("Button 3"));

 * @param {String} [ax] ("left" by default) horizontal alignment:

     "left"
     "center"
     "right"

 * @param {String} [ay] ("top" by default) vertical alignment:

     "top"
     "center"
     "bottom"

 * @param {String} [dir] ("horizontal" by default) a direction
 * the component has to be placed in the layout

     "vertical"
     "horizontal"

 * @param {Integer} [gap] a space in pixels between laid out components
 * @class  zebkit.layout.FlowLayout
 * @constructor
 * @extends {zebkit.layout.Layout}
 */
pkg.FlowLayout = Class(pkg.Layout, [
    function $prototype() {
        /**
         * Gap between laid out components
         * @attribute gap
         * @readOnly
         * @type {Integer}
         * @default 0
         */
        this.gap = 0;

        /**
         * Horizontal laid out components alignment
         * @attribute ax
         * @readOnly
         * @type {String}
         * @default "left"
         */
        this.ax = "left";

        /**
         * Vertical laid out components alignment
         * @attribute ay
         * @readOnly
         * @type {String}
         * @default "center"
         */
        this.ay = "center";

        /**
         * Laid out components direction
         * @attribute direction
         * @readOnly
         * @type {String}
         * @default "horizontal"
         */
        this.direction = "horizontal";

        this.stretchLast = false;

        this[''] =  function (ax, ay, dir, g){
            if (arguments.length === 1) this.gap = ax;
            else {
                if (arguments.length >= 2) {
                    this.ax = ax;
                    this.ay = ay;
                }

                if (arguments.length > 2)  {
                    this.direction = zebkit.util.$validateValue(dir, "horizontal", "vertical");
                }

                if (arguments.length > 3) this.gap = g;
            }
        };

        this.calcPreferredSize = function (c){
            var m = { width:0, height:0 }, cc = 0;
            for(var i = 0;i < c.kids.length; i++){
                var a = c.kids[i];
                if (a.isVisible === true){
                    var d = a.getPreferredSize();
                    if (this.direction === "horizontal"){
                        m.width += d.width;
                        m.height = d.height > m.height ? d.height : m.height;
                    }
                    else {
                        m.width = d.width > m.width ? d.width : m.width;
                        m.height += d.height;
                    }
                    cc++;
                }
            }

            var add = this.gap * (cc > 0 ? cc - 1 : 0);
            if (this.direction === "horizontal") m.width += add;
            else m.height += add;
            return m;
        };

        this.doLayout = function(c){
            var psSize  = this.calcPreferredSize(c),
                t       = c.getTop(),
                l       = c.getLeft(),
                lastOne = null,
                ew      = c.width  - l - c.getRight(),
                eh      = c.height - t - c.getBottom(),
                px      = ((this.ax === "right") ? ew - psSize.width
                                                 : ((this.ax === "center") ? Math.floor((ew - psSize.width) / 2) : 0)) + l,
                py      = ((this.ay === "bottom") ? eh - psSize.height
                                                  : ((this.ay === "center") ? Math.floor((eh - psSize.height) / 2): 0)) + t;

            for(var i = 0;i < c.kids.length; i++){
                var a = c.kids[i];
                if (a.isVisible === true) {

                    var d = a.getPreferredSize(),
                        ctr = a.constraints == null ? null : a.constraints;

                    if (this.direction === "horizontal") {
                        ctr = ctr || this.ay;

                        if (ctr === "stretch") {
                            d.height = c.height - t - c.getBottom();
                        }

                        a.setLocation(px, ctr === "stretch" ? t :
                                          (ctr === "top"    ? py :
                                          (ctr === "bottom" ? Math.floor(psSize.height - d.height) + py :
                                                              Math.floor((psSize.height - d.height) / 2) + py)));
                        px += (d.width + this.gap);
                    }
                    else {
                        ctr = ctr || this.ax;

                        if (ctr === "stretch") {
                            d.width = c.width - l - c.getRight();
                        }

                        a.setLocation(ctr === "stretch"  ? l  :
                                      (ctr === "left"    ? px :
                                      (ctr === "right"   ? px + Math.floor(psSize.width - d.width) :
                                                           px + Math.floor((psSize.width - d.width) / 2))), py);

                        py += d.height + this.gap;
                    }

                    a.setSize(d.width, d.height);
                    lastOne = a;
                }
            }

            if (lastOne !== null && this.stretchLast === true){
                if (this.direction === "horizontal") {
                    lastOne.setSize(c.width - lastOne.x - c.getRight(), lastOne.height);
                }
                else {
                    lastOne.setSize(lastOne.width, c.height - lastOne.y - c.getBottom());
                }
            }
        };
    }
]);

/**
 * List layout places components vertically one by one

        // create panel and set list layout for it
        var p = new zebkit.ui.Panel();
        p.setLayout(new zebkit.layout.ListLayout());

        // add three buttons into the panel with list layout
        p.add(new zebkit.ui.Button("Item 1"));
        p.add(new zebkit.ui.Button("Item 2"));
        p.add(new zebkit.ui.Button("Item 3"));

 * @param {String} [ax] horizontal list item alignment:

     "left"
     "right"
     "center"
     "stretch"

 * @param {Integer} [gap] a space in pixels between laid out components
 * @class  zebkit.layout.ListLayout
 * @constructor
 * @extends {zebkit.layout.Layout}
 */
pkg.ListLayout = Class(pkg.Layout,[
    function $prototype() {
        /**
         * Horizontal list items alignment
         * @attribute ax
         * @type {String}
         * @readOnly
         */
        this.ax = "stretch";

        /**
         * Pixel gap between list items
         * @attribute gap
         * @type {Integer}
         * @readOnly
         */
        this.gap = 0;

        this[''] = function (ax, gap) {
            if (arguments.length === 1) {
                this.gap = ax;
            } else if (arguments.length > 1) {
                this.ax  = zebkit.util.$validateValue(ax, "stretch", "left", "right", "center");
                this.gap = gap;
            }
        };

        this.calcPreferredSize = function (lw){
            var w = 0, h = 0, c = 0;
            for(var i = 0; i < lw.kids.length; i++){
                var kid = lw.kids[i];
                if (kid.isVisible === true){
                    var d = kid.getPreferredSize();
                    h += (d.height + (c > 0 ? this.gap : 0));
                    c++;
                    if (w < d.width) w = d.width;
                }
            }
            return { width:w, height:h };
        };

        this.doLayout = function (lw){
            var x   = lw.getLeft(),
                y   = lw.getTop(),
                psw = lw.width - x - lw.getRight();

            for(var i = 0;i < lw.kids.length; i++){
                var cc = lw.kids[i];

                if (cc.isVisible === true){
                    var d      = cc.getPreferredSize(),
                        constr = cc.constraints == null ? this.ax
                                                        : cc.constraints;

                    cc.setSize    ((constr === "stretch") ? psw
                                                            : d.width, d.height);
                    cc.setLocation((constr === "stretch") ? x
                                                            : x + ((constr === "right") ? psw - cc.width
                                                                                        : ((constr === "center") ? Math.floor((psw - cc.width) / 2)
                                                                                                                 : 0)), y);
                    y += (d.height + this.gap);
                }
            }
        };
    }
]);

/**
 * Percent layout places components vertically or horizontally and
 * sizes its according to its percentage constraints.

        // create panel and set percent layout for it
        var p = new zebkit.ui.Panel();
        p.setLayout(new zebkit.layout.PercentLayout());

        // add three buttons to the panel that are laid out horizontally with
        // percent layout according to its constraints: 20, 30 and 50 percents
        p.add(20, new zebkit.ui.Button("20%"));
        p.add(30, new zebkit.ui.Button("30%"));
        p.add(50, new zebkit.ui.Button("50%"));

 * @param {String} [dir] a direction of placing components. The
 * value can be "horizontal" or "vertical"
 * @param {Integer} [gap] a space in pixels between laid out components
 * @param {Boolean} [stretch] true if the component should be stretched
 * vertically or horizontally
 * @class  zebkit.layout.PercentLayout
 * @constructor
 * @extends {zebkit.layout.Layout}
 */
pkg.PercentLayout = Class(pkg.Layout, [
    function $prototype() {
         /**
          * Direction the components have to be placed (vertically or horizontally)
          * @attribute direction
          * @readOnly
          * @type {String}
          * @default "horizontal"
          */
        this.direction = "horizontal";

        /**
         * Pixel gap between components
         * @attribute gap
         * @readOnly
         * @type {Integer}
         * @default 2
         */
        this.gap = 2;

        /**
         * Boolean flag that say if the laid out components have
         * to be stretched vertically (if direction is set to "vertical")
         * or horizontally (if direction is set to "horizontal")
         * @attribute stretch
         * @readOnly
         * @type {Integer}
         * @default true
         */
        this.stretch = true;

        this[''] = function(dir, gap, stretch) {
            if (arguments.length > 0) {
                this.direction = zebkit.util.$validateValue(dir, "horizontal", "vertical");
                if (arguments.length > 1) this.gap = gap;
                if (arguments.length > 2) this.stretch = stretch;
            }
        };

        this.doLayout = function(target){
            var right  = target.getRight(),
                top    = target.getTop(),
                bottom = target.getBottom(),
                left   = target.getLeft(),
                size   = target.kids.length,
                rs     = -this.gap * (size === 0 ? 0 : size - 1),
                loc    = 0,
                ns     = 0;

            if (this.direction === "horizontal"){
                rs += target.width - left - right;
                loc = left;
            }
            else{
                rs += target.height - top - bottom;
                loc = top;
            }

            for(var i = 0; i < size; i ++ ){
                var l = target.kids[i], c = l.constraints, useps = (c === "usePsSize");
                if (this.direction === "horizontal"){
                    ns = ((size - 1) === i) ? target.width - right - loc
                                            : (useps ? l.getPreferredSize().width
                                                     : ~~((rs * c) / 100));
                    var yy = top, hh = target.height - top - bottom;
                    if (this.stretch === false) {
                        var ph = hh;
                        hh = l.getPreferredSize().height;
                        yy = top + Math.floor((ph - hh) / 2);
                    }

                    l.setBounds(loc, yy, ns, hh);
                }
                else {
                    ns = ((size - 1) === i) ? target.height - bottom - loc
                                            : (useps ? l.getPreferredSize().height
                                                     : Math.floor((rs * c) / 100));
                    var xx = left, ww = target.width - left - right;
                    if (this.stretch === false) {
                        var pw = ww;
                        ww = l.getPreferredSize().width;
                        xx = left + Math.floor((pw - ww) / 2);
                    }

                    l.setBounds(xx, loc, ww, ns);
                }
                loc += (ns + this.gap);
            }
        };

        this.calcPreferredSize = function (target){
            var max  = 0,
                size = target.kids.length,
                as   = this.gap * (size === 0 ? 0 : size - 1);

            for(var i = 0; i < size; i++){
                var d = target.kids[i].getPreferredSize();
                if (this.direction === "horizontal"){
                    if (d.height > max) max = d.height;
                    as += d.width;
                }
                else {
                    if (d.width > max) max = d.width;
                    as += d.height;
                }
            }
            return (this.direction === "horizontal") ? { width:as, height:max }
                                                     : { width:max, height:as };
        };
    }
]);

/**
 * Grid layout manager constraints. Constraints says how a  component has to be placed in
 * grid layout virtual cell. The constraints specifies vertical and horizontal alignments,
 * a virtual cell paddings, etc.
 * @param {Integer} [ax] a horizontal alignment
 * @param {Integer} [ay] a vertical alignment
 * @param {Integer} [p]  a cell padding
 * @constructor
 * @class zebkit.layout.Constraints
 */
pkg.Constraints = Class([
    function $prototype() {
        /**
         * Top cell padding
         * @attribute top
         * @type {Integer}
         * @default 0
         */

        /**
         * Left cell padding
         * @attribute left
         * @type {Integer}
         * @default 0
         */

        /**
         * Right cell padding
         * @attribute right
         * @type {Integer}
         * @default 0
         */

        /**
         * Bottom cell padding
         * @attribute bottom
         * @type {Integer}
         * @default 0
         */

        /**
         * Horizontal alignment
         * @attribute ax
         * @type {String}
         * @default "stretch"
         */

        /**
         * Vertical alignment
         * @attribute ay
         * @type {String}
         * @default "stretch"
         */

        this.top = this.bottom = this.left = this.right = 0;
        this.ay = this.ax = "stretch";
        this.rowSpan = this.colSpan = 1;

        this[''] = function(ax, ay, p) {
            if (arguments.length > 0) {
                this.ax = ax;
                if (arguments.length > 1) this.ay = ay;
                if (arguments.length > 2) this.setPadding(p);

                zebkit.util.$validateValue(this.ax, "stretch", "left", "center", "right");
                zebkit.util.$validateValue(this.ay, "stretch", "top", "center", "bottom");
            }
        };

        /**
         * Set all four paddings (top, left, bottom, right) to the given value
         * @param  {Integer} p a padding
         * @method setPadding
         */

        /**
         * Set top, left, bottom, right paddings
         * @param  {Integer} t a top padding
         * @param  {Integer} l a left padding
         * @param  {Integer} b a bottom padding
         * @param  {Integer} r a right padding
         * @method setPadding
         */
        this.setPadding = function(t,l,b,r) {
            if (arguments.length === 1) {
                this.top = this.bottom = this.left = this.right = t;
            }
            else {
                this.top    = t;
                this.bottom = b;
                this.left   = l;
                this.right  = r;
            }
        };
    }
]);

/**
 * Grid layout manager. can be used to split a component area to
 * number of virtual cells where children components can be placed.
 * The way how the children components have to be laid out in the cells can
 * be customized by using "zebkit.layout.Constraints" class:

        // create constraints
        var ctr = new zebkit.layout.Constraints();

        // specify cell top, left, right, bottom paddings
        ctr.setPadding(8);
        // say the component has to be left aligned in a
        // virtual cell of grid layout
        ctr.ax = "left";

        // create panel and set grid layout manager with two
        // virtual rows and columns
        var p = new zebkit.ui.Panel();
        p.setLayout(new zebkit.layout.GridLayout(2,2));

        // add children component
        p.add(ctr, new zebkit.ui.Label("Cell 1,1"));
        p.add(ctr, new zebkit.ui.Label("Cell 1,2"));
        p.add(ctr, new zebkit.ui.Label("Cell 2,1"));
        p.add(ctr, new zebkit.ui.Label("Cell 2,2"));

 * @param {Integer} rows a number of virtual rows to layout
 * children components
 * @param {Integer} cols a number of virtual columns to
 * layout children components
 * @param {String} [ax] horizontal alignment
 * @param {String} [ay] vertical alignment
 * layout children components
 * @constructor
 * @class  zebkit.layout.GridLayout
 * @extends {zebkit.layout.Layout}
 */
pkg.GridLayout = Class(pkg.Layout, [
    function $prototype() {
        this.stretchCols = this.stretchRows = false;

        this[''] = function(r, c, stretchRows, stretchCols) {
            /**
             * Number of virtual rows to place children components
             * @attribute rows
             * @readOnly
             * @type {Integer}
             */
            this.rows = r;

            /**
             * Number of virtual columns to place children components
             * @attribute cols
             * @readOnly
             * @type {Integer}
             */
            this.cols = c;

            this.colSizes = Array(c + 1);
            this.rowSizes = Array(r + 1);

            /**
             * Default constraints that is applied for children components
             * that doesn't define own constraints
             * @type {zebkit.layout.Constraints}
             * @attribute constraints
             */
            this.constraints = new pkg.Constraints();

            if (stretchRows != null) this.stretchRows = stretchRows;
            if (stretchCols != null) this.stretchCols = stretchCols;
        };

        /**
         * Calculate columns metrics
         * @param  {zebkit.layout.Layoutable} c the target container
         * @return {Array} a columns widths
         * @method calcCols
         * @protected
         */
        this.calcCols = function(c){
            this.colSizes[this.cols] = 0;
            for(var i = 0;i < this.cols; i++) {
                this.colSizes[i] = this.calcCol(i, c);
                this.colSizes[this.cols] += this.colSizes[i];
            }
            return this.colSizes;
        };

        /**
         * Calculate rows metrics
         * @param  {zebkit.layout.Layoutable} c the target container
         * @return {Array} a rows heights
         * @method calcRows
         * @protected
         */
        this.calcRows = function(c){
            this.rowSizes[this.rows] = 0;
            for(var i = 0;i < this.rows; i++) {
                this.rowSizes[i] = this.calcRow(i, c);
                this.rowSizes[this.rows] += this.rowSizes[i];
            }
            return this.rowSizes;
        };

        /**
         * Calculate the given row height
         * @param  {Integer} row a row
         * @param  {zebkit.layout.Layoutable} c the target container
         * @return {Integer} a size of the row
         * @method calcRow
         * @protected
         */
        this.calcRow = function(row, c){
            var max = 0, s = row * this.cols;
            for (var i = s; i < c.kids.length && i < s + this.cols; i++) {
                var a = c.kids[i];
                if (a.isVisible === true) {
                    var arg = a.constraints || this.constraints,
                        d   = a.getPreferredSize().height;

                    d += (arg.top + arg.bottom);
                    if (d > max) max = d;
                }
            }
            return max;
        };

        /**
         * Calculate the given column width
         * @param  {Integer} col a column
         * @param  {zebkit.layout.Layoutable} c the target container
         * @return {Integer} a size of the column
         * @method calcCol
         * @protected
         */
        this.calcCol = function(col, c){
            var max = 0;

            for(var i = col; i < c.kids.length; i += this.cols) {
                var a = c.kids[i];
                if (a.isVisible === true) {
                    var arg = a.constraints || this.constraints,
                        d   = a.getPreferredSize().width + arg.left + arg.right;

                    if (d > max) max = d;
                }
            }
            return max;
        };

        this.calcPreferredSize = function(c){
            return { width : this.calcCols(c)[this.cols],
                     height: this.calcRows(c)[this.rows] };
        };

        this.doLayout = function(c){
            var rows     = this.rows,
                cols     = this.cols,
                colSizes = this.calcCols(c),
                rowSizes = this.calcRows(c),
                top      = c.getTop(),
                left     = c.getLeft();

            if (this.stretchCols) {
                var dw = c.width - left - c.getRight() - colSizes[cols];
                for(var i = 0;i < cols; i ++ ) {
                    colSizes[i] = colSizes[i] + (colSizes[i] !== 0 ? Math.floor((dw * colSizes[i]) / colSizes[cols]) : 0);
                }
            }

            if (this.stretchRows) {
                var dh = c.height - top - c.getBottom() - rowSizes[rows];
                for(var i = 0;i < rows; i++) {
                    rowSizes[i] = rowSizes[i] + (rowSizes[i] !== 0 ? Math.floor((dh * rowSizes[i]) / rowSizes[rows]) : 0);
                }
            }

            var cc = 0;
            for (var i = 0; i < rows && cc < c.kids.length; i++) {
                var xx = left;
                for(var j = 0;j < cols && cc < c.kids.length; j++, cc++){
                    var l = c.kids[cc];
                    if (l.isVisible === true){
                        var arg   = l.constraints || this.constraints,
                            d     = l.getPreferredSize(),
                            cellW = colSizes[j],
                            cellH = rowSizes[i];

                        cellW -= (arg.left + arg.right);
                        cellH -= (arg.top  + arg.bottom);

                        if ("stretch" === arg.ax) d.width  = cellW;
                        if ("stretch" === arg.ay) d.height = cellH;

                        l.setSize(d.width, d.height);
                        l.setLocation(
                            xx  + arg.left + ("stretch" === arg.ax ? 0
                                                                   : ((arg.ax === "right") ? cellW - d.width
                                                                                           : ((arg.ax === "center") ? Math.floor((cellW - d.width) / 2)
                                                                                                                    : 0))),
                            top + arg.top  + ("stretch" === arg.ay ? 0
                                                                   : ((arg.ay === "bottom" ) ? cellH - d.height
                                                                                             : ((arg.ay === "center") ? Math.floor((cellH - d.height) / 2)
                                                                                                                      : 0)))
                        );

                        xx += colSizes[j];
                    }
                }
                top += rowSizes[i];
            }
        };
    }
]);

/**
 * @for
 */

})(zebkit("layout"), zebkit.Class);