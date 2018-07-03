# obfc.js
Object Based Flow Charts(obfc): Draws SVG-based flow charts by creating objects in your web pages.
obfc.js is an object-based JavaScript Library for drawing SVG flow charts acroos modern web browsers. It makes easily to construct objects, links and connections. Moreover, it dispatches a click event when an object or a line is clicked and descriptions can be added for all clicks.
# More documents about obfc.js
* <a href="https://www.e-adys.com/obfc-js/object-based-flow-charts-obfc-js/" target="_blank">All Posts</a>
* <a href="https://www.e-adys.com/obfc-js/obfc-js-example" target="_blank">An Example</a>
* <a href="https://www.e-adys.com/obfc-js/properties-of-a-svg-shape" target="_blank">Properties of a SVG shape</a>
* <a href="https://www.e-adys.com/obfc-js/obfc-js-all-svg-shapes" target="_blank">All SVG Shapes</a>
* <a href="https://www.e-adys.com/obfc-js/obfc-js-creating-lines/" target="_blank">Creating Lines</a>
* <a href="https://www.e-adys.com/obfc-js/obfc-js-collision-detection-editmode-and-console-log" target="_blank">Collision Detection, Editmode and Console.log</a>
* <a href="https://www.e-adys.com/obfc-js/obfc-js-free-draw-and-free-write-functions" target="_blank"><em>free_draw</em> and <em>free_write</em> functions</a>

# SVG Shapes
obfc.js has 24 different SVG shapes that can be divided into four groups:  
* Operation Symbols:Process, Predefined Process, Alternate Process, Delay, Preparation, Manual Operation
* Branching and Control of Flow Symbols:Terminal, Decision, Connector (Inspection), Off-Page Connector, OR, Summing Junction
* Input and Output Symbols: Data, Document, Multi - Document, Display, Manual Input, Card, Punched Tape
* File and Information Storage Symbols: Stored Data, Magnetic Disk, Direct Access - Storage, Internal Storage, Sequential Access Storage - Magnetic Tape

# Usage
To use obfc.js the following:
```javascript
<script src="obfc.js"></script>
```
and then add svg element to body of a web page.
```javascript
<svg id="demo" width="600" height="700"> </svg>
```
and then connect library to the id of the SVG element.
```javascript
<script>
prepare_SVG("demo");
</script>
```
# Creating SVG Shapes
To draw objects, add_theObject function can be used for the given SVG element.
```javascript
<script>
var object1 = add_theObject(new Terminal(300, 50, 1, "Hello obfc.js", 20, "<h3>Description in HTML format</h3>"));
var object2 = add_theObject(new Process(300, 150, 1, ["Line 1", "Line 2"], 10));
</script>
```
add_theObject is a function that adds the object into a given SVG element and returns this object. This returned object is used for drawing lines between two objects. There are 24 different SVG objects in obfc.js. 22 of them contain 9 parameters for creating an object. First two parameters are required, others are optimal. 
```javascript
Object_Name(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
```
* _middle_x and middle_y: centre of the object. (Required)
* _size: For example, default size of a process object width is 125 and height is 50. _size value is multiplied by these values.
* _text and _text_size: Text is written in the center of an object. This parameter can be defined string value or array["", ""...]. If your text is too long, you can use array for creating lines.
* _description: These value can be coded in HTML format. These value is displayed in a HTML element that contains "desc" id after clicking an object or a line. 
* _fill_color: Default value is white. But, the object color can be determined with this parameter.
* _stroke_color: Default value is black.
* _text_color: Default value is black.
2 of them (OR and  SummingJunction) contain 7 parameter. These objects are not included parameters of _text and _text_size.
Object_Name(_middle_x, _middle_y, _size, _description, _fill_color, _stroke_color, _text_color);

# Creating Lines Between Objects

After creating all objects, objects can be linked by using draw_theLine function.
```javascript
<script>
var o_line1 = draw_theLine(new Line(object1, object2, 1, 0, "Text", 12, "<b>Description in HTML format</b>"));
</script>
```
Line is a function that determines the path for given two objects and their positions. This function has 9 parameters. First two parameter is required and others are optimal.
```javascript
Line(object1, object2, position1, position2, _text, _text_size, _description, _stroke_color, _text_color)
```
* object1 ve object2: are variables that is defined in the previous section.
* position1 and position2: are position information of objects. There are four positions for all shapes. Top=0, Bottom=1, Left=2 and Right=3. But, when these values are not entered or entered "-1", this function automatically determines these position by calculating differences between all unused positions. (Unused position means that this position is used for creating lines)
* _text and _text: text in line. This function selects the longest sub-line for writing text. 
* description, _stroke_color, _text_color: (same with previous section)

# Animation
(ver 1.2.)
<a href="https://www.e-adys.com/web_tasarimi_programlama/animation-for-your-web-pages/" target="_blank">Click for more information.</a>

# Publications
<b>Object-based Entity Relationship Diagram Drawing Library: EntRel.JS.</b> Uzun, E.; Yerlikaya, T.; and Kırat, O. In 7th International Scientific Conference “TechSys 2018” – Engineering, Technologies and Systems, Technical University of Sofia, Plovdiv Branch May 17-19, pages 114-119, 2018. 

<b>Object-based flowchart drawing library.</b> Uzun, E.; and Buluş, H., N. In 2017 International Conference on Computer Science and Engineering (UBMK), pages 110-115, 2017. 

<a href="https://www.e-adys.com/yayinlar/" target="_blank">Click for bibtex, downloads, all publications...</a>

# Licence
Copyright (c) 2017 Erdinç Uzun

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
