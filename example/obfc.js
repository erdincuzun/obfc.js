// Object Based Flow Charts 
// obfc.js, v1.1
// Copyright (c)2017 Erdinç Uzun
// Distributed under MIT license
// https://github.com/erdincuzun/obfc.js

var polyline_start = "<polyline points=";
var polyline_end = " style=\"fill:none;stroke:black;stroke-width:2\" marker-end=\"url(#arrow)\" />";
var object_array = [];
var line_array = [];
var id_theSVG = "demo";
var id_theDesc = "desc";
var open_ruler = false;
var fill_color = "white";
var stroke_color = "black";
var text_color = "black";
var highlight_color = "red";

function prepare_SVG(_id_theSVG) {   
    id_theSVG = _id_theSVG; 	
    line_array = [];
    object_array = [];
    document.getElementById(id_theSVG).innerHTML = "<defs><marker id=\"arrow\" markerWidth=\"8\" markerHeight=\"10\" refX=\"8\" refY=\"3\" orient=\"auto\" markerUnits=\"strokeWidth\"> <path d=\"M0,0 L0,6 L9,3 z\" fill=\"black\" /> </marker> </defs>";
    document.getElementById(id_theSVG).innerHTML += "<defs><marker id=\"arrow2\" markerWidth=\"8\" markerHeight=\"10\" refX=\"8\" refY=\"3\" orient=\"auto\" markerUnits=\"strokeWidth\"> <path d=\"M0,0 L0,6 L9,3 z\" fill=\"red\" /> </marker> </defs>";
    
    if (open_ruler) {       
        document.getElementById(id_theSVG).innerHTML += "<defs><pattern id=\"smallGrid\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"><path d=\"M 10 0 L 0 0 0 10\" fill=\"none\" stroke=\"gray\" stroke-width=\"0.5\" /></pattern>";
        document.getElementById(id_theSVG).innerHTML += "<pattern id=\"grid\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><rect width=\"100\" height=\"100\" fill=\"url(#smallGrid)\" /><path d=\"M 100 0 L 0 0 0 100\" fill=\"none\" stroke=\"gray\" stroke-width=\"1\" /></pattern></defs>";
        document.getElementById(id_theSVG).innerHTML += "<rect width=\"100%\" height=\"100%\" fill=\"url(#grid)\" />";
        var _cnt_x = document.getElementById(id_theSVG).clientWidth / 100;
        var _cnt_y = document.getElementById(id_theSVG).clientHeight / 100;
        if (_cnt_x == 0) _cnt_x = 10;
        if (_cnt_y == 0) _cnt_y = 10;
        document.getElementById(id_theSVG).innerHTML += "<text x='0' y='13' fill='blue'>0,0</text>";
        for (var i = 1; i < _cnt_x; i++)
            document.getElementById(id_theSVG).innerHTML += "<text x=\"" + (100 * i) + "\" y=\"13\" fill=\"blue\" text-anchor=\"middle\">" + (100 * i) + "</text>";
        for (var i = 1; i < _cnt_y; i++)
            document.getElementById(id_theSVG).innerHTML += "<text x=\"0\" y=\"" + (100 * i + 6) + "\" fill=\"blue\">" + (100 * i) + "</text>";
    }
}

//Operation Symbols START
function Process(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    this.Name = "Process";
    this.ID = "";
    this.middle_x = _middle_x;
    this.middle_y = _middle_y;
    if (typeof _size === 'undefined' || _size == null)
        _size = 1;
    this.size = _size;
    this.text = _text;
    if (typeof _text_size === 'undefined' || _text_size == null)
        _text_size = 1;
    this.text_size = _text_size * _size;
    this.probable_x_y = [[0, 0], [0, 0], [0, 0], [0, 0]]; //top_bottom_left_right
    this.points = [false, false, false, false]; //status of connection points
    this.width = 125 * this.size;
    this.height = 50 * this.size;
    this.start_x = this.middle_x - this.width / 2;
    this.start_y = this.middle_y - this.height / 2;

    this.text = [];
    if (typeof _text === 'undefined' || _text == null)
        this.text = [];
    else if (typeof _text === 'string')
        this.text = [_text];
    else
        this.text = _text;

    this.description = "";
    if (typeof _description === 'undefined' || _description == null)
        this.description = "";
    else
        this.description = _description;

    this.fill_color = "white";
    if (typeof _fill_color === 'undefined' || _fill_color == null)
        this.fill_color = fill_color;
    else
        this.fill_color = _fill_color;

    this.stroke_color = "black";
    if (typeof _fill_color === 'undefined' || _fill_color == null)
        this.stroke_color = stroke_color;
    else
        this.stroke_color = _stroke_color;

    this.text_color = "black";
    if (typeof _text_color === 'undefined' || _text_color == null)
        this.text_color = text_color;
    else
        this.text_color = _text_color;

    //Array first parameter: 0_top, 1_bottom, 2_left, 3_right
    //Array second parameter: 0_x, 1_y
    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - this.height / 2;
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + this.height / 2;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2;
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + this.width / 2;
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<rect x=\"" + this.start_x + "\" y=\"" + this.start_y + "\" width=\"" + this.width + "\" height=\"" + this.height + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";
        return temp;
    }
}

function PredefinedProcess(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Predefined Process";

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<rect x=\"" + this.start_x + "\" y=\"" + this.start_y + "\" width=\"" + this.width + "\" height=\"" + this.height + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<line x1=\"" + (this.start_x + this.width / 10) + "\" y1=\"" + this.start_y + "\" x2=\"" + (this.start_x + this.width / 10) + "\" y2=\"" + (this.start_y + this.height) + "\" style=\"stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<line x1=\"" + (this.start_x + this.width - this.width / 10) + "\" y1=\"" + this.start_y + "\" x2=\"" + (this.start_x + this.width - this.width / 10) + "\" y2=\"" + (this.start_y + this.height) + "\" style=\"stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";
        return temp;
    }
}

function AlternateProcess(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Alternate Process";

    this.Draw = function () {
        var rx = 5 * this.size;
        var ry = 5 * this.size;

        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<rect x=\"" + this.start_x + "\" y=\"" + this.start_y + "\" rx=\"" + rx + "\" ry=\"" + ry + "\" width=\"" + this.width + "\" height=\"" + this.height + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";
        return temp;
    }
}

function Delay(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Delay";
    this.width = 100 * this.size;
    this.height = 50 * this.size;

    this.probable_x_y = [[0, 0], [0, 0], [0, 0]];
    this.probable_x_y[0][0] = (this.middle_x * this.size) - (12 * this.size);
    this.probable_x_y[0][1] = this.middle_y - this.height / 2;
    this.probable_x_y[1][0] = this.middle_x * this.size - (12 * this.size);
    this.probable_x_y[1][1] = this.middle_y + this.height / 2;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2 - (12 * this.size);
    this.probable_x_y[2][1] = this.middle_y;

    this.Draw = function () {
        var rx = 5 * this.size;
        var ry = 5 * this.size;
        var width2 = 220 * this.size;

        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<path d=\"M" + this.start_x + " " + this.start_y + " L" + (this.start_x + this.width / 2) + " " + this.start_y + " "
            + "C" + (this.start_x + this.width / 2) + " " + this.start_y + ", " + (this.start_x + width2)+" " + (this.start_y+this.height/2) + ", " + (this.start_x + this.width / 2) + " " + (this.start_y+this.height) + " "
            + "L" + this.start_x + " " + (this.start_y+this.height) + " L" + this.start_x + " " + this.start_y + "\" " 
            + "style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", (this.middle_x - 25*this.size), this.middle_y, this.height, "center", _text_color);
        temp += "</g>";
        return temp;
    }
}

function Preparation(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Preparation";

    this.width = 150 * this.size;
    this.height = 50 * this.size;
    this.start_x = this.middle_x - (this.width / 2);
    this.start_y = this.middle_y - (this.height / 2);

    //width and height are equal in Decision
    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - (this.height / 2);
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + (this.height / 2);
    //left-right
    this.probable_x_y[2][0] = this.middle_x - (this.width / 2);
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + (this.width / 2);
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<polygon points=\"" + (this.start_x + (25 * this.size)) + "," + this.start_y + " " + (this.start_x + this.width - (25 * this.size)) + "," + this.start_y + " "
            + (this.start_x + this.width) + "," + (this.start_y + this.height - (25 * this.size)) + " " + (this.start_x + this.width - (25 * this.size)) + "," + (this.start_y + this.height) + " "
            + (this.start_x + (25 * this.size)) + "," + (this.start_y + this.height) + " " + this.start_x + "," + (this.start_y + this.height - (25 * this.size))
            + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function ManualOperation(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Manual Operation";

    //left-right
    this.probable_x_y[2][0] = this.middle_x - ((this.width / 2) - 10 * this.size);
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + ((this.width / 2) - 10 * this.size);
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<polygon points=\"" + this.start_x + "," + this.start_y + " " + (this.start_x + this.width) + "," + this.start_y + " "
            + (this.start_x + this.width - 20 * this.size) + "," + (this.start_y + this.height) + " " + (this.start_x + 20 * this.size) + "," + (this.start_y + this.height) + " "            
            + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

//Process / Operation Symbols END

//Branching and Control of Flow Symbols START
function Terminal(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Terminal";   

    this.Draw = function () {
        var rx = 25 * this.size;
        var ry = 35 * this.size;

        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<rect x=\"" + this.start_x + "\" y=\"" + this.start_y + "\" rx=\"" + rx + "\" ry=\"" + ry + "\" width=\"" + this.width + "\" height=\"" + this.height + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function Decision(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);

    this.Name = "Decision";
    this.width_c = 75 * this.size;
    this.height_c = 75 * this.size;
    this.start_x_c = this.middle_x - this.width_c / 2;
    this.start_y_c = this.middle_y - this.height_c / 2;
    //for collisions
    this.height = 2 * Math.sqrt(this.width_c * this.width_c / 2);
    this.width = 2 * Math.sqrt(this.width_c * this.width_c / 2);
    this.start_x = this.middle_x - (this.width / 2);
    this.start_y = this.middle_y - (this.width / 2);

    this.sekmiddle_y = this.middle_y + Math.sqrt(this.width * this.width + this.height * this.height) / 2;
    //width and height are equal in Decision
    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - Math.sqrt(this.width_c * this.width_c / 2);
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + Math.sqrt(this.width_c * this.width_c / 2);
    //left-right
    this.probable_x_y[2][0] = this.middle_x - Math.sqrt(this.width_c * this.width_c / 2);
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + Math.sqrt(this.width_c * this.width_c / 2);
    this.probable_x_y[3][1] = this.middle_y;
    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<rect transform=\"rotate(45 " + (this.middle_x) + " " + (this.middle_y) + ")\" x=\"" + this.start_x_c + "\" y=\"" + this.start_y_c + "\" width=\"" + this.width_c + "\" height=\"" + this.height_c + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height * 2 / 5, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function Connector(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Connector (Inspection)";
    this.width = 30 * _size;
    this.height = 30 * _size;
    this.start_x = _middle_x - this.width / 2;
    this.start_y = _middle_y - this.height / 2;

    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - this.height / 2;
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + this.height / 2;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2;
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + this.width / 2;
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<circle cx=\"" + this.middle_x+ "\" cy=\"" + this.middle_y + "\" r=\"" + (this.width / 2) + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, (this.middle_y-2), this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function OffPage_Connector(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Off-Page Connector";
    this.width = 40 * _size;
    this.height = 40 * _size;
    this.start_x = _middle_x - this.width / 2;
    this.start_y = _middle_y - this.height / 2;

    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - this.height / 2;
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + this.height / 2;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2;
    this.probable_x_y[2][1] = this.middle_y - 5 * this.size;
    this.probable_x_y[3][0] = this.middle_x + this.width / 2;
    this.probable_x_y[3][1] = this.middle_y - 5 * this.size;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        style =
        temp += "<polygon points=\"" + this.start_x + "," + this.start_y + " " + (this.start_x + this.width) + "," + this.start_y + " "
            + (this.start_x + this.width) + "," + (this.start_y + this.height - 10 * this.size) + " " + (this.middle_x) + "," + (this.middle_y + this.height / 2) + " "
            + (this.start_x) + "," + (this.start_y + this.height - 10 * this.size) + " "
            + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, (this.middle_y - 5 * this.size), this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function OR(_middle_x, _middle_y, _size, _description, _fill_color, _stroke_color, _text_color) {
    Connector.call(this, _middle_x, _middle_y, _size, "", "", _description, _fill_color, _stroke_color, _text_color);
    this.Name = "OR";

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<circle cx=\"" + this.middle_x + "\" cy=\"" + this.middle_y + "\" r=\"" + (this.width / 2) + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<line x1=\"" + (this.middle_x) + "\" y1=\"" + (this.middle_y - this.width / 2) + "\" x2=\"" + (this.middle_x) + "\" y2=\"" + (this.middle_y + this.width / 2) + "\" style=\"stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<line x1=\"" + (this.middle_x - this.width / 2) + "\" y1=\"" + (this.middle_y) + "\" x2=\"" + (this.middle_x + this.width / 2) + "\" y2=\"" + (this.middle_y) + "\" style=\"stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "</g>";

        return temp;
    }
}

function SummingJunction(_middle_x, _middle_y, _size, _description, _fill_color, _stroke_color, _text_color) {
    Connector.call(this, _middle_x, _middle_y, _size, "", "", _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Summing Junction";

    this.Draw = function () {
        var kose = Math.sqrt(this.width * this.width / 8);
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<circle cx=\"" + this.middle_x + "\" cy=\"" + this.middle_y + "\" r=\"" + (this.width / 2) + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<line x1=\"" + (this.middle_x-kose) + "\" y1=\"" + (this.middle_y - kose) + "\" x2=\"" + (this.middle_x + kose) + "\" y2=\"" + (this.middle_y + kose) + "\" style=\"stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<line x1=\"" + (this.middle_x+kose) + "\" y1=\"" + (this.middle_y - kose) + "\" x2=\"" + (this.middle_x - kose) + "\" y2=\"" + (this.middle_y + kose) + "\" style=\"stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "</g>";

        return temp;
    }
}

//Branching and Control of Flow Symbols END

//Input and Output Symbols START
function Data(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Data (Input/Output)";

    //width and height are equal in Decision
    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - (this.height / 2);
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + (this.height / 2);
    //left-right
    this.probable_x_y[2][0] = this.middle_x - (this.width / 2 - 10 * this.size);
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + (this.width / 2 - 10 * this.size);
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<polygon points=\"" + (this.start_x + (20 * this.size)) + "," + this.start_y + " " + (this.start_x + this.width) + "," + this.start_y + " " + (this.start_x + this.width - (20 * this.size)) + "," + (this.start_y + this.height) + " " + this.start_x + "," + (this.start_y + this.height) + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function Document(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Document";

    this.probable_x_y[2][0] = this.middle_x - (this.width / 2) + 1 * this.size;
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + (this.width / 2) - 1 * this.size;
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<path d=\"M " + this.start_x + " " + this.start_y + " L " + this.start_x + " " + (this.start_y + this.height) + " ";
        temp += "Q " + (this.start_x + this.width / 4) + " " + (this.start_y + this.height + 15 * this.size) + ", " + (this.start_x + this.width / 2) + " " + (this.start_y + this.height);
        temp += "T " + (this.start_x + this.width) + " " + (this.start_y + this.height);
        temp += "L " + (this.start_x + this.width) + " " + this.start_y + " Z\"";
        temp += " style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function MultiDocument(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Multi - Document";

    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + (this.height / 2) + 5 * this.size;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2 - 8 * this.size;
    this.probable_x_y[2][1] = this.middle_y + 5 * this.size;


    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        for (var i = 0; i < 3; i++) {
            var m = - i * 4 * this.size;
            temp += "<path d=\"M " + (this.start_x + m) + " " + (this.start_y - m) + " L " + (this.start_x + m) + " " + ((this.start_y - m) + this.height) + " ";
            temp += "Q " + ((this.start_x + m) + this.width / 4) + " " + ((this.start_y - m) + this.height + 15 * this.size) + ", " + ((this.start_x + m) + this.width / 2) + " " + ((this.start_y - m) + this.height);
            temp += "T " + ((this.start_x + m) + this.width) + " " + ((this.start_y - m) + this.height);
            temp += "L " + ((this.start_x + m) + this.width) + " " + (this.start_y - m) + " Z\"";
            temp += " style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        }
        
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x - 6 * this.size , this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function Display(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Display";

    this.probable_x_y[3][0] = this.middle_x + (this.width / 2) - 1 * this.size;
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<path d=\"M " + (this.start_x + 15 * this.size) + " " + this.start_y + " L " + (this.start_x + this.width - 20 * this.size) + " " + (this.start_y) + " ";
        temp += "Q " + (this.start_x + this.width + 17 * this.size) + " " + (this.middle_y) + ", " + (this.start_x + this.width - 20 * this.size) + " " + (this.start_y + this.height);
        temp += "L " + (this.start_x + 15 * this.size) + " " + (this.start_y + this.height) + " ";
        temp += "L " + (this.start_x) + " " + (this.middle_y) + " Z\"";
        temp += " style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function ManualInput(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Manual Input";

    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - (this.height / 2) + 5 * this.size;
    this.probable_x_y[2][0] = this.start_x;
    this.probable_x_y[2][1] = this.middle_y + 3 * this.size;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<polygon points=\"" + (this.start_x) + "," + (this.start_y + 10 * this.size) + " " + (this.start_x + this.width) + ","
            + this.start_y + " " + (this.start_x + this.width) + "," + (this.start_y + this.height) + " " + this.start_x + ","
            + (this.start_y + this.height)
            + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function Card(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Manual Input";

    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - (this.height / 2) + 5 * this.size;
    this.probable_x_y[2][0] = this.start_x;
    this.probable_x_y[2][1] = this.middle_y + 3 * this.size;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<polygon points=\"" + (this.start_x) + "," + (this.start_y + 10 * this.size) + " " + (this.start_x + 15 * this.size) + "," + (this.start_y) +
            " " + (this.start_x + this.width) + "," + this.start_y + " " + (this.start_x + this.width) + "," + (this.start_y + this.height) + " " + this.start_x + "," + (this.start_y + this.height) + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function PunchedTape(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Punched Tape";

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<path d=\"M " + this.start_x + " " + this.start_y + " L " + this.start_x + " " + (this.start_y + this.height) + " ";
        temp += "Q " + (this.start_x + this.width / 4) + " " + (this.start_y + this.height + 10 * this.size) + ", " + (this.start_x + this.width / 2) + " " + (this.start_y + this.height);
        temp += "T " + (this.start_x + this.width) + " " + (this.start_y + this.height);
        temp += "L " + (this.start_x + this.width) + " " + this.start_y + " ";
        temp += "Q " + (this.start_x + this.width - this.width / 4) + " " + (this.start_y - 10 * this.size) + ", " + (this.start_x + this.width / 2) + " " + (this.start_y);
        temp += "T " + (this.start_x) + " " + (this.start_y) + " Z\"";
        temp += " style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}
//Input and Output Symbols END

//File and Information Storage Symbols START
function StoredData(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Stored Data";

    this.probable_x_y[2][0] = this.start_x + 3 * this.size;
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + (this.width / 2) - 7 * this.size;
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<path d=\"M " + (this.start_x + 15 * this.size) + " " + this.start_y + " L " + (this.start_x + this.width) + " " + (this.start_y) + " ";
        temp += "Q " + (this.start_x + this.width - 15 * this.size) + " " + (this.middle_y) + "," + (this.start_x + this.width) + " " + (this.start_y + this.height); + " ";
        temp += "L " + (this.start_x + 15 * this.size) + " " + (this.start_y + this.height) + " ";
        temp += "Q " + (this.start_x - 10 * this.size) + " " + (this.middle_y) + ", " + (this.start_x + 15 * this.size) + " " + (this.start_y) + " Z\"";
        temp += " style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function MagneticDisk(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Magnetic Disk - Database";

    this.width = 75 * _size;
    this.height = 60 * _size;
    this.start_x = _middle_x - this.width / 2;
    this.start_y = _middle_y - this.height / 2;

    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - this.height / 2;
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + this.height / 2;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2;
    this.probable_x_y[2][1] = this.middle_y - 5 * this.size;
    this.probable_x_y[3][0] = this.middle_x + this.width / 2;
    this.probable_x_y[3][1] = this.middle_y - 5 * this.size;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<path d=\"M " + (this.start_x) + " " + (this.start_y);
        temp += " Q " + (_middle_x) + " " + (this.middle_y - this.height / 2 - 15 * this.size) + ", " + (this.start_x + this.width) + " " + (this.start_y);
        temp += " L " + (this.start_x + this.width) + " " + (this.start_y + this.height);
        temp += " L " + (this.start_x) + " " + (this.start_y + this.height) + " Z\"";
        temp += " style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<path d=\"M " + (this.start_x) + " " + (this.start_y);
        temp += " Q " + (_middle_x) + " " + (this.middle_y - this.height / 2 + 15 * this.size) + ", " + (this.start_x + this.width) + " " + (this.start_y) + "\"";
        temp += " style=\"fill:transparent;stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function DirectAccess(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Direct Access - Storage";

    this.width = 75 * _size;
    this.height = 75 * _size;
    this.start_x = _middle_x - this.width / 2;
    this.start_y = _middle_y - this.height / 2;

    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - this.height / 2;
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + this.height / 2;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2;
    this.probable_x_y[2][1] = this.middle_y - 5 * this.size;
    this.probable_x_y[3][0] = this.middle_x + this.width / 2;
    this.probable_x_y[3][1] = this.middle_y - 5 * this.size;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<path d=\"M " + (this.start_x) + " " + (this.start_y);
        temp += " L " + (this.start_x + this.width) + " " + (this.start_y);
        temp += " Q " + (this.start_x + this.width + 25 * this.size) + " " + (this.middle_y) + ", " + (this.start_x + this.width) + " " + (this.start_y + this.height);
        temp += " L " + (this.start_x) + " " + (this.start_y + this.height) + " Z\"";
        temp += " style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<path d=\"M " + (this.start_x + this.width) + " " + (this.start_y);
        temp += " Q " + (this.start_x + this.width - 25 * this.size) + " " + (this.middle_y) + ", " + (this.start_x + this.width) + " " + (this.start_y + this.height) + "\"";
        temp += " style=\"fill:transparent;stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", this.middle_x, this.middle_y, this.height, "center", _text_color);
        temp += "</g>";

        return temp;
    }
}

function InternalStorage(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Internal Storage";
    this.width = 75 * _size;
    this.height = 75 * _size;
    this.start_x = _middle_x - this.width / 2;
    this.start_y = _middle_y - this.height / 2;

    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - this.height / 2;
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + this.height / 2;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2;
    this.probable_x_y[2][1] = this.middle_y - 5 * this.size;
    this.probable_x_y[3][0] = this.middle_x + this.width / 2;
    this.probable_x_y[3][1] = this.middle_y - 5 * this.size;

    this.Draw = function () {
        temp = "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";
        temp += "<rect x=\"" + this.start_x + "\" y=\"" + this.start_y + "\" width=\"" + this.width + "\" height=\"" + this.height + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<line x1=\"" + (this.start_x) + "\" y1=\"" + (this.start_y + this.height / 5) + "\" x2=\"" + (this.start_x + this.width) + "\" y2=\"" + (this.start_y + this.height / 5) + "\" style=\"stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<line x1=\"" + (this.start_x + this.width / 5) + "\" y1=\"" + this.start_y + "\" x2=\"" + (this.start_x + this.width / 5) + "\" y2=\"" + (this.start_y + this.height) + "\" style=\"stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", (this.middle_x + this.width / 10), (this.middle_y), this.height, "center", _text_color);
        temp += "</g>";
        return temp;
    }
}

function MagneticTape(_middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color) {
    Process.call(this, _middle_x, _middle_y, _size, _text, _text_size, _description, _fill_color, _stroke_color, _text_color);
    this.Name = "Sequential Access Storage - Magnetic Tape";
    this.width = 70 * _size;
    this.height = 70 * _size;
    this.start_x = _middle_x - this.width / 2;
    this.start_y = _middle_y - this.height / 2;

    this.probable_x_y[0][0] = this.middle_x;
    this.probable_x_y[0][1] = this.middle_y - this.height / 2 - 2 * this.size;
    this.probable_x_y[1][0] = this.middle_x;
    this.probable_x_y[1][1] = this.middle_y + this.height / 2 + 2 * this.size;
    this.probable_x_y[2][0] = this.middle_x - this.width / 2 + 2 * this.size;
    this.probable_x_y[2][1] = this.middle_y;
    this.probable_x_y[3][0] = this.middle_x + this.width / 2 - 2 * this.size;
    this.probable_x_y[3][1] = this.middle_y;

    this.Draw = function () {
        temp = "<defs><clipPath id=\"magTape_" + this.ID.substring(7) + "\">";
        temp += "<rect class=\"closed\" x=\"" + this.start_x + "\" y=\"" + this.start_y + "\" width=\"" + this.width + "\" height=\"" + (this.height / 70 * 54) + "\" />";
        temp += "<rect class=\"closed\" x=\"" + this.start_x + "\" y=\"" + (this.start_y + this.height / 70 * 50) + "\" width=\"" + (this.width / 70 * 40) + "\" height=\"" + (this.height / 70 * 52) + "\" />";
        temp += "</clipPath></defs>";

        temp += "<g id=\"" + this.ID + "\" onclick=\"doClick_Object(evt)\" style=\"cursor:pointer\">";       
        temp += "<rect x=\"" + (this.start_x + this.width / 2) + "\" y=\"" + (this.start_y + this.height / 70 * 50) + "\" width=\"" + (this.width / 70 * 40) + "\" height=\"" + (this.height / 70 * 18) + "\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        temp += "<circle cx=\"" + _middle_x + "\" cy=\"" + _middle_y + "\" r=\"" + (this.height / 70 * 33) + "\" clip-path=\"url(#magTape_" + this.ID.substring(7) + ")\" style=\"fill:" + this.fill_color + ";stroke:" + this.stroke_color + ";stroke-width:2\" />";
        if (this.text.length > 0)
            temp += writeText(this.text, this.text_size, "normal", (this.middle_x + this.width / 10), (this.middle_y), this.height, "center", _text_color);
        temp += "</g>";
        return temp;
    }
}

//File and Information Storage Symbols END

//for more description http://www.breezetree.com/article-excel-flowchart-shapes.htm


function doClick_Object(evt) {
    //paint all svg rects, polygons, paths, circles, lines, polylines...
    var theSvg = document.getElementById(id_theSVG);
    
    var theLines = theSvg.getElementsByTagName("polyline");
    for (var i = 0; i < theLines.length; i++) {
        if (theLines[i].parentNode.getAttribute("id").indexOf("Line_") != -1) {
            var theID = theLines[i].parentElement.getAttribute('id');
            var theID_int = parseInt(theID.substring(5));
            var theLine = line_array[theID_int - 1];
            theLines[i].setAttribute("style", "fill:none;stroke:" + theLine.stroke_color + ";stroke-width:2");
            theLines[i].setAttribute("marker-end", "url(#arrow)");
        }
    }

    var theTags = ["rect", "polygon", "path", "circle", "line"];
    for (var j = 0; j < theTags.length; j++) {
        var theTag = theSvg.getElementsByTagName(theTags[j]);
        for (var i = 0; i < theTag.length; i++) {
            if (theTag[i].parentNode.getAttribute("id").indexOf("Object_") != -1) {
                var theID = theTag[i].parentElement.getAttribute('id');
                var theID_int = parseInt(theID.substring(7));
                var theObjectx = object_array[theID_int - 1];
                if (theTags[j] != "Line")
                    theTag[i].setAttribute("style", "fill:" + theObjectx.fill_color + ";stroke:" + theObjectx.stroke_color + ";stroke-width:2");
                else
                    theLines[i].setAttribute("style", "stroke:" + theObjectx.stroke_color + ";stroke-width:2");
            }
        }
    }

    var theObject = evt.target.parentElement.childNodes;
    if (typeof theObject != 'undefined')
    {
        if (theObject[0].nodeName == "tspan")
            theObject = evt.target.parentElement.parentElement.childNodes; //tspan etiketine týklarsa, parent iki üstte

        if (theObject[0].nodeName == "rect" || theObject[0].nodeName == "polygon" || theObject[0].nodeName == "path" || theObject[0].nodeName == "circle") {
            theObject[0].setAttribute("style", "fill:white;stroke:" + highlight_color + ";stroke-width:4");

            var theID = theObject[0].parentElement.getAttribute('id');
            var theID_int = parseInt(theID.substring(7));
            var theObjectx = object_array[theID_int - 1];
            var temp = theObjectx.ID + " - " + theObjectx.Name + ", Middle x - y: " + theObjectx.middle_x + " - " + theObjectx.middle_y + ", Size:" + theObjectx.size + ", Width - Height: " + theObjectx.width + " - " + theObjectx.height + ", Text Size:" + theObjectx.text_size + "\n";
            for (var i = 0; i < theObjectx.probable_x_y.length; i++) {
                if (i == 0) temp += "  top x - y: "; else if (i == 1) temp += "bottom x - y: "; else if (i == 2) temp += "left x - y: "; else if (i == 3) temp += "right x - y: ";
                temp += theObjectx.probable_x_y[i][0] + " - " + theObjectx.probable_x_y[i][1];
                if (i != theObjectx.probable_x_y.length - 1)
                    temp += ", ";
            }
            writeConsoleText(temp, "information");

            document.getElementById(id_theDesc).innerHTML = "";
            for (var i = 0; i < theObjectx.text.length; i++) {
                document.getElementById(id_theDesc).innerHTML += "<h2>" + theObjectx.text[i] + "</h2><br />";
            }

            document.getElementById(id_theDesc).innerHTML += "<br />" + theObjectx.description; //desc
        }

        //other objects: lines
        for (var i = 1; i < theObject.length; i++) {
            if (theObject[i].nodeName == "line")
                theObject[i].setAttribute("style", "stroke:" + highlight_color + ";stroke-width:4");
            else if (theObject[i].nodeName == "rect" || theObject[i].nodeName == "polygon" || theObject[i].nodeName == "path" || theObject[i].nodeName == "circle")
                theObject[i].setAttribute("style", "fill:white;stroke:" + highlight_color + ";stroke-width:4");

        }

    }
    
}

function writeConsoleText(_text, _state) {
    var console_color = "Black";
    var console_bc = "White";
    if (typeof _state === 'undefined' || _state == null) {
        console_bc = "White";
    }
    else if (_state == "information") {
        console_bc = "LightGreen";
    }
    else if (_state == "warning") {
        console_bc = "LightSalmon";
    }

    var _color = "color:" + console_color + ";font-weight:bold; background-color: " + console_bc + ";";
    console.log("%c" + _text, _color);
}

function writeText(_text, _text_size, _font_weight, _middle_x, _middle_y, _object_height, _align, _text_color) {
    if (typeof _text === 'undefined' || _text == null)
        _text = ["Empty Text"];
    else if (typeof _text === 'string')
        _text = [_text];
    if (typeof _text_size === 'undefined' || _text_size == null)
        _text_size = 12;
    if (typeof _font_weight === 'undefined' || _font_weight == null)
        _font_weight = "normal";
    if (typeof _middle_x === 'undefined' || _middle_x == null)
        _middle_x = 100;
    if (typeof _middle_y === 'undefined' || _middle_y == null)
        _middle_y = 5;
    if (typeof _object_height === 'undefined' || _object_height == null)
        _object_height = 300;
    if (typeof _align === 'undefined' || _align == "center" || _align == null)
        _align = "alignment-baseline=\"middle\" text-anchor=\"middle\"";
    else
        _align = "";
    if (typeof _text_color === 'undefined' || _text_color == null)
        _text_color = "black";

    var _row_count = _text.length;   
    var _row_size = _object_height / _row_count;
    var _pos = _middle_y - (_object_height / 2) + (_row_size / 2) + 6;

    var temp = "<text x=\"" + _middle_x + "\" y=\"" + _middle_y + "\" " + _align + " font-family=\"Verdana\" font-size=\"" + _text_size + "\" font-weight=\"" + _font_weight + "\" fill=\"" + _text_color + "\">"
    for (var i = 0; i < _row_count; i++) {
        temp += "<tspan x=\"" + _middle_x + "\" y=\"" + _pos + "\">" + _text[i] + "</tspan>";
        _pos += _row_size;
    }
    temp += "</text>"
    return temp;
}

function Line(object1, object2, position1, position2, _text, _text_size, _description, _stroke_color, _text_color) {
    this.Name = "Line";
    this.ID = "";
    
    this.text = [];
    if (typeof _text === 'undefined' || _text == null)
        this.text = [];
    else if (typeof _text === 'string')
        this.text = [_text];
    else
        this.text = _text;

    this.description = "";
    if (typeof _description === 'undefined' || _description == null)
        this.description = "";
    else
        this.description = _description;

    this.stroke_color = "black";
    if (typeof _stroke_color === 'undefined' || _stroke_color == null)
        this.stroke_color = stroke_color;
    else
        this.stroke_color = _stroke_color;

    this.text_color = "black";
    if (typeof _text_color === 'undefined' || _text_color == null)
        this.text_color = text_color;
    else
        this.text_color = _text_color;

    if (!(typeof object1 === 'undefined' || object1 == null) && !(typeof object2 === 'undefined' || object2 == null)) {
        this.o1_probable_x_y = object1.probable_x_y;
        this.o2_probable_x_y = object2.probable_x_y;

        if (typeof position1 === 'undefined' || position1 == null || typeof position2 === 'undefined' || position2 == null) {
            position1 = -1;
            position2 = -1;
        }
            
        //find positions if position value = -1
        if (position1 == -1 || position2 == -1) {
            var _p = Connect_Two_Objects(object1, object2);
            if (_p != null) {
                position1 = _p[0];
                position2 = _p[1];
               
                var _theID_int1 = parseInt(object1.ID.substring(7));
                object_array[_theID_int1 - 1].points[position1] = true;
                var _theID_int2 = parseInt(object2.ID.substring(7));
                object_array[_theID_int2 - 1].points[position2] = true;               
            }            
        }            

        if (position1 > object1.probable_x_y.length - 1) {
            writeConsoleText("There is " + (object1.probable_x_y.length) + " points in the " + object1.Name, "warning");
            position1 = object1.probable_x_y.length - 1;
        }
        if (position2 > object2.probable_x_y.length - 1) {
            writeConsoleText("There is " + (object2.probable_x_y.length) + " points in the " + object2.Name, "warning");
            position2 = object2.probable_x_y.length - 1;
        }


        this.o1_size = object1.size;
        this.o2_size = object2.size;
        this.big_size = this.o1_size;
        if (this.o2_size > this.o1_size)
            this.big_size = this.o2_size;

        this.text_size = _text_size;

        //this.line_start_end_x_y = [[0, 0], [0, 0]];//line - start and end coordinates to draw a new line to connect this line
        var selection1 = [0, 0];
        var selection2 = [0, 0];
        if (object1 != null && object2 != null) {
            selection1 = [this.o1_probable_x_y[position1][0], this.o1_probable_x_y[position1][1]];
            selection2 = [this.o2_probable_x_y[position2][0], this.o2_probable_x_y[position2][1]];
        }
    }

    //Array first parameter: 0_top, 1_bottom, 2_left, 3_right
    this.LinesData = "";


    this.Draw = function () {
        if (object1 == null || object2 == null)
            return ""; //object error so no line draw   
        //document.getElementById("test").innerHTML += "p: " + position1 + " - " + position2 + "<br />";
        //document.getElementById("test").innerHTML += "x: " + selection1[0] + " - " + selection2[0] + " = " + (selection1[0] - selection2[0]) + "<br>";
        //document.getElementById("test").innerHTML += "y: " + selection1[1] + " - " + selection2[1] + " = " + (selection1[1] - selection2[1]) + "<br>";

        var c1 = 10 * this.o1_size;
        var c2 = 10 * this.o2_size;
        var ok = 40 * this.big_size;
        var cizgi1 = 80 * this.o1_size;
        var cizgi2 = 80 * this.o2_size;
        var dik1 = 35 * this.o1_size;
        var dik2 = 35 * this.o2_size;

        var temp = "";
        if (position1 == 1 && position2 == 0) { //bottom - top
            if (selection1[1] - selection2[1] <= -ok) //y
            {
                temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1) + " "
                     + selection2[0] + "," + (selection1[1] + c1) + " " + selection2[0] + "," + selection2[1];
            }
            else {
                if (selection1[0] - selection2[0] > (150 * this.big_size)) {
                    x = selection1[0] - cizgi1;
                    y = selection2[1] - ok;
                }
                else if (selection1[0] - selection2[0] >= 0) {
                    x = selection1[0] + cizgi1;
                    y = selection2[1] - ok;
                    if (selection1[1] - selection2[1] < 20)
                        y = selection1[1] - (2 * dik1 - c1);
                }
                else if (selection1[0] - selection2[0] >= (-150 * this.big_size)) {
                    x = selection1[0] - cizgi1;
                    y = selection2[1] - ok;
                    if (selection1[1] - selection2[1] < 20)
                        y = selection1[1] - (2 * dik1 - c1);
                }
                else {
                    x = selection1[0] + cizgi1;
                    y = selection2[1] - ok;
                }

                temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1) + " "
                     + x + "," + (selection1[1] + c1) + " " + x + "," + (y) + " "
                     + selection2[0] + "," + (y) + " " + selection2[0] + "," + selection2[1];
            }
        }
        else if (position1 == 0 && position2 == 1) {
            if (selection1[1] - selection2[1] >= ok) //y
            {
                temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                     + selection2[0] + "," + (selection1[1] - c1) + " " + selection2[0] + "," + selection2[1];
            }
            else {
                if (selection1[0] - selection2[0] > (150 * this.big_size)) {
                    x = selection1[0] - cizgi1;
                    y = selection2[1] + ok;
                }
                else if (selection1[0] - selection2[0] >= 0) {
                    x = selection1[0] + cizgi1;
                    y = selection2[1] + ok;
                    if (selection1[1] - selection2[1] > -20)
                        y = selection1[1] + 2 * dik1 - c1;
                }
                else if (selection1[0] - selection2[0] >= (-150 * this.big_size)) {
                    x = selection1[0] - cizgi1;
                    y = selection2[1] + ok;
                    if (selection1[1] - selection2[1] > -20)
                        y = selection1[1] + 2 * dik1 - c1;
                }
                else {
                    x = selection1[0] + cizgi1;
                    y = selection2[1] + ok;
                }

                temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                     + x + "," + (selection1[1] - c1) + " " + x + "," + (y) + " "
                     + selection2[0] + "," + (y) + " " + selection2[0] + "," + selection2[1];
            }
        }
        else if (position1 == 0 && position2 == 0) {
            if (selection1[1] - selection2[1] >= -30) {
                if (selection1[0] - selection2[0] < 70 && selection1[0] - selection2[0] > -70) {
                    dif = selection1[0] - selection2[0] + cizgi1;
                    if (selection1[0] - selection2[0] > 0)
                        dif = selection1[0] - selection2[0] - cizgi1;
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                    + (selection1[0] - dif) + "," + (selection1[1] - c1) + " " + (selection1[0] - dif) + "," + (selection2[1] - ok) + " "
                    + selection2[0] + "," + (selection2[1] - ok) + " " + selection2[0] + "," + selection2[1];
                }
                else {
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                + selection1[0] + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok) + " "
                + selection2[0] + "," + selection2[1];
                }
            }
            else {
                if (selection1[0] - selection2[0] < 70 && selection1[0] - selection2[0] > -70) {
                    dif = cizgi1;
                    if (selection1[0] - selection2[0] > 0)
                        dif = -cizgi1;
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                    + (selection1[0] - dif) + "," + (selection1[1] - c1) + " " + (selection1[0] - dif) + "," + (selection2[1] - ok) + " "
                    + selection2[0] + "," + (selection2[1] - ok) + " " + selection2[0] + "," + selection2[1];
                }
                else {
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                + selection2[0] + "," + (selection1[1] - c1) + " " + selection2[0] + "," + selection2[1];
                }
            }
        }
        else if (position1 == 1 && position2 == 1) {
            if (selection1[1] - selection2[1] >= 0) {
                if (selection1[0] - selection2[0] < 70 && selection1[0] - selection2[0] > -70) {
                    dif = cizgi1;
                    if (selection1[0] - selection2[0] > 0)
                        dif = -cizgi1;
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1) + " "
                    + (selection1[0] + dif) + "," + (selection1[1] + c1) + " " + (selection1[0] + dif) + "," + (selection2[1] + ok) + " "
                    + selection2[0] + "," + (selection2[1] + ok) + " " + selection2[0] + "," + selection2[1];
                }
                else {
                    if (selection1[1] - selection2[1] >= 0 && selection1[1] - selection2[1] <= 20)
                        y = ok;
                    else
                        y = c1;
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + y) + " "
                + selection2[0] + "," + (selection1[1] + y) + " " + selection2[0] + "," + selection2[1];
                }
            }
            else {
                if (selection1[0] - selection2[0] < 70 && selection1[0] - selection2[0] > -70) {
                    dif = cizgi1;
                    if (selection1[0] - selection2[0] > 0)
                        dif = -cizgi1;
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1) + " "
                    + (selection2[0] - dif) + "," + (selection1[1] + c1) + " " + (selection2[0] - dif) + "," + (selection2[1] + ok) + " "
                    + selection2[0] + "," + (selection2[1] + ok) + " " + selection2[0] + "," + selection2[1];
                }
                else {
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection2[1] + ok) + " "
                + selection2[0] + "," + (selection2[1] + ok) + " " + selection2[0] + "," + selection2[1];
                }
            }
        }
        else if (position1 == 1 && position2 == 2) {
            if (selection1[1] - selection2[1] >= 0) {
                if (selection1[0] - selection2[0] < 40 && selection1[0] - selection2[0] > -105)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1) + " "
                    + " " + (selection1[0] - cizgi1) + "," + (selection1[1] + c1) + " " + (selection1[0] - cizgi1) + "," + selection2[1]
                    + " " + selection2[0] + "," + selection2[1];
                else if (selection1[0] - selection2[0] < -105)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1) + " "
                    + " " + (selection2[0] - ok) + "," + (selection1[1] + c1) + " " + (selection2[0] - ok) + "," + selection2[1]
                    + " " + selection2[0] + "," + selection2[1];
                else if (selection1[0] - selection2[0] > 40)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1) + " "
                    + (selection2[0] - ok) + "," + (selection1[1] + c1) + " " + (selection2[0] - ok) + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
            }
            else {
                if (selection1[0] - selection2[0] > -40)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1) + " "
                    + (selection2[0] - ok) + "," + (selection1[1] + c1) + " " + (selection2[0] - ok) + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                else if (selection1[0] - selection2[0] < -40)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + selection2[1] + " "
                    + " " + selection2[0] + "," + selection2[1];

            }
        }
        else if (position1 == 2 && position2 == 1) {
            if (selection1[1] - selection2[1] <= 0) {
                if (selection1[0] - selection2[0] >= -62.5 && selection1[0] - selection2[0] < 105)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] - cizgi1) + "," + selection1[1]
                    + " " + (selection2[0] - cizgi1) + "," + (selection2[1] + ok) + " " + selection2[0] + "," + (selection2[1] + ok)
                    + " " + selection2[0] + "," + selection2[1];
                else if (selection1[0] - selection2[0] < -62.5)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                    + " " + (selection1[0] - c1) + "," + (selection2[1] + ok) + " " + selection2[0] + "," + (selection2[1] + ok)
                    + " " + selection2[0] + "," + selection2[1];
                else //(>105)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                    + " " + (selection1[0] - c1) + "," + (selection2[1] + ok) + " " + selection2[0] + "," + (selection2[1] + ok)
                    + " " + selection2[0] + "," + selection2[1];
            }
            else {
                if (selection1[0] - selection2[0] >= c1)
                    temp += selection1[0] + "," + selection1[1] + " " + selection2[0] + "," + selection1[1]
                    + " " + selection2[0] + "," + selection2[1];
                else
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                    + " " + (selection1[0] - c1) + "," + (selection2[1] + ok) + " " + selection2[0] + "," + (selection2[1] + ok)
                    + " " + selection2[0] + "," + selection2[1];
            }
        }
        else if (position1 == 2 && position2 == 2) {
            if (selection1[1] - selection2[1] < -dik1) {
                if (selection1[0] - selection2[0] >= -40)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] - ok) + "," + selection1[1]
                    + " " + (selection2[0] - ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                else
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                    + " " + (selection1[0] - c1) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
            }
            else {
                if (selection1[1] - selection2[1] >= dik1) {
                    if (selection1[0] - selection2[0] <= -ok)
                        temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                        + " " + (selection1[0] - c1) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                    else
                        temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] - ok) + "," + selection1[1]
                        + " " + (selection2[0] - ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                }
                else {
                    if (selection1[0] - selection2[0] < 0)
                        temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                        + " " + (selection1[0] - c1) + "," + (selection1[1] + dik1)
                        + " " + (selection2[0] - ok) + "," + (selection1[1] + dik1) + " " + (selection2[0] - ok) + "," + selection2[1]
                        + " " + selection2[0] + "," + selection2[1];
                    else
                        temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                        + " " + (selection1[0] - c1) + "," + (selection2[1] + dik1)
                        + " " + (selection2[0] - ok) + "," + (selection2[1] + dik1) + " " + (selection2[0] - ok) + "," + selection2[1]
                        + " " + selection2[0] + "," + selection2[1];
                }
            }
        }
        else if (position1 == 0 && position2 == 2) {
            if (selection1[1] - selection2[1] >= 0) {
                if (selection1[0] - selection2[0] < -40)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                else if (selection1[0] - selection2[0] < 200)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                    + (selection2[0] - ok) + "," + (selection1[1] - c1) + " " + (selection2[0] - ok) + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                else
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                        + (selection2[0] - ok) + "," + (selection1[1] - c1) + " " + (selection2[0] - ok) + "," + selection2[1] + " "
                        + selection2[0] + "," + selection2[1];
            }
            else {
                if (selection1[0] - selection2[0] < -105)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                    + (selection1[0] + cizgi1) + "," + (selection1[1] - c1) + " " + (selection1[0] + cizgi1) + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                else if (selection1[0] - selection2[0] < 62.5)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                    + (selection1[0] - cizgi1) + "," + (selection1[1] - c1) + " " + (selection1[0] - cizgi1) + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                else {
                    if (selection1[1] - selection2[1] < 0 && selection1[1] - selection2[1] > -25)
                        temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection2[1] - dik1) + " "
                            + (selection2[0] - ok) + "," + (selection2[1] - dik1) + " " + (selection2[0] - ok) + "," + selection2[1] + " "
                            + selection2[0] + "," + selection2[1];
                    else
                        temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                        + (selection2[0] - ok) + "," + (selection1[1] - c1) + " " + (selection2[0] - ok) + "," + selection2[1] + " "
                        + selection2[0] + "," + selection2[1];
                }

            }
        }
        else if (position1 == 2 && position2 == 0) {
            if (selection1[1] - selection2[1] < -75) {                
                temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                + " " + (selection1[0] - c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                + " " + selection2[0] + "," + selection2[1];
            }
            else {                
                if (selection1[0] - selection2[0] < 0) {
                    if (selection1[1] - selection2[1] < 0){                        
                        temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                    + " " + (selection1[0] - c1) + "," + (selection1[1] + dik1) + " " + selection2[0] + "," + (selection1[1] + dik1)
                    + " " + selection2[0] + "," + selection2[1];
                    }                        
                    else {                        
                        if (selection1[0] - selection2[0] < -62.5)
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                                + " " + (selection1[0] - c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                                + " " + selection2[0] + "," + selection2[1];
                        else
                            temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] - cizgi1) + "," + selection1[1]
                            + " " + (selection2[0] - cizgi1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                            + " " + selection2[0] + "," + selection2[1];
                    }
                }
                else {
                    if (selection1[1] - selection2[1] < -35)
                        temp += selection1[0] + "," + selection1[1] + " " + selection2[0] + "," + selection1[1] +
                        " " + selection2[0] + "," + selection2[1];
                    else
                        if (selection1[0] - selection2[0] < 80)
                            temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] - cizgi1) + "," + selection1[1]
                            + " " + (selection2[0] - cizgi1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                            + " " + selection2[0] + "," + selection2[1];
                        else
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - c1) + "," + selection1[1]
                            + " " + (selection1[0] - c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                            + " " + selection2[0] + "," + selection2[1];
                }
            }
        }
        else if (position1 == 0 && position2 == 3) {
            if (selection1[1] - selection2[1] >= 0) {
                if (selection1[0] - selection2[0] > 40)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                else if (selection1[0] - selection2[0] > -200) {
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                    + (selection2[0] + ok) + "," + (selection1[1] - c1) + " " + (selection2[0] + ok) + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                }
                else {
                    if (selection1[1] - selection2[1] > 40)
                        temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                        + (selection2[0] + ok) + "," + (selection1[1] - c1) + " " + (selection2[0] + ok) + "," + selection2[1] + " "
                        + selection2[0] + "," + selection2[1];
                    else
                        temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection2[1] - dik2) + " "
                        + (selection2[0] + ok) + "," + (selection2[1] - dik2) + " " + (selection2[0] + ok) + "," + selection2[1] + " "
                        + selection2[0] + "," + selection2[1];
                }
            }
            else {
                if (selection1[0] - selection2[0] > 105)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                    + (selection1[0] - cizgi1) + "," + (selection1[1] - c1) + " " + (selection1[0] - cizgi1) + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                else if (selection1[0] - selection2[0] > -62.5)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                    + (selection1[0] + cizgi1) + "," + (selection1[1] - c1) + " " + (selection1[0] + cizgi1) + "," + selection2[1] + " "
                    + selection2[0] + "," + selection2[1];
                else {
                    if (selection1[1] - selection2[1] < 40 && selection1[1] - selection2[1] > -25)
                        temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection2[1] - dik1) + " "
                            + (selection2[0] + ok) + "," + (selection2[1] - dik1) + " " + (selection2[0] + ok) + "," + selection2[1] + " "
                            + selection2[0] + "," + selection2[1];
                    else
                        temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] - c1) + " "
                        + (selection2[0] + ok) + "," + (selection1[1] - c1) + " " + (selection2[0] + ok) + "," + selection2[1] + " "
                        + selection2[0] + "," + selection2[1];
                }
            }
        }
        else if (position1 == 3 && position2 == 0) {            
            if (selection1[1] - selection2[1] < -75) {                
                if (selection1[0] - selection2[0] > -20) {                    
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                   + " " + (selection1[0] + c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                   + " " + selection2[0] + "," + selection2[1];
                }                   
                else {                    
                    temp += selection1[0] + "," + selection1[1] + " " + selection2[0] + "," + selection1[1] +
                               " " + selection2[0] + "," + selection2[1];
                }                   
            }
            else {                
                if (selection1[0] - selection2[0] < 0) {                    
                    if (selection1[1] - selection2[1] > -40) {
                        if (selection1[0] - selection2[0] > 0)
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                            + " " + (selection1[0] + c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                            + " " + selection2[0] + "," + selection2[1];
                        else {
                            if (selection1[0] - selection2[0] > -82.5)
                                temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] + cizgi2) + "," + selection1[1]
                                + " " + (selection2[0] + cizgi2) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                                + " " + selection2[0] + "," + selection2[1];
                            else
                                temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                                    + " " + (selection1[0] + c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                                    + " " + selection2[0] + "," + selection2[1];
                        }

                    }
                    else {                        
                        temp += selection1[0] + "," + selection1[1] + " " + selection2[0] + "," + selection1[1] +
                                " " + selection2[0] + "," + selection2[1];
                    }
                }
                else {                    
                    if (selection1[1] - selection2[1] > -75) {                        
                        if (selection1[1] - selection2[1] < -15)
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                            + " " + (selection1[0] + c1) + "," + (selection1[1] - dik1) + " " + selection2[0] + "," + (selection1[1] - dik1)
                            + " " + selection2[0] + "," + selection2[1];
                        else {
                            if (selection1[0] - selection2[0] <= 62.5)
                                temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] + cizgi2) + "," + selection1[1]
                                + " " + (selection2[0] + cizgi2) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                                + " " + selection2[0] + "," + selection2[1];
                            else
                                temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                                + " " + (selection1[0] + c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                                + " " + selection2[0] + "," + selection2[1];
                        }
                    }
                    else {                        
                        if (selection1[0] - selection2[0] < 80) {                            
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                            + " " + (selection1[0] + c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                            + " " + selection2[0] + "," + selection2[1];
                        }                            
                        else
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                            + " " + (selection1[0] + c1) + "," + (selection2[1] - ok) + " " + selection2[0] + "," + (selection2[1] - ok)
                            + " " + selection2[0] + "," + selection2[1];
                    }
                }
            }
        }
        else if (position1 == 1 && position2 == 3) {
            if (selection1[1] - selection2[1] > 25) {
                if (selection1[0] - selection2[0] <= 110 && selection1[0] - selection2[0] >= -32.5)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1)
                     + " " + (selection1[0] + cizgi1) + "," + (selection1[1] + c1) + " " + (selection1[0] + cizgi1) + "," + selection2[1]
                    + " " + selection2[0] + "," + selection2[1] + " ";
                else
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1)
                     + " " + (selection2[0] + ok) + "," + (selection1[1] + c1) + " " + (selection2[0] + ok) + "," + selection2[1]
                    + " " + selection2[0] + "," + selection2[1] + " ";

            }
            else if (selection1[1] - selection2[1] > -45) {
                temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection2[1] + dik1)
                 + " " + (selection2[0] + ok) + "," + (selection2[1] + dik2) + " " + (selection2[0] + ok) + "," + selection2[1]
                + " " + selection2[0] + "," + selection2[1] + " ";
            }

            else {
                if (selection1[0] - selection2[0] <= 40)
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + (selection1[1] + c1)
                     + " " + (selection2[0] + ok) + "," + (selection1[1] + c1) + " " + (selection2[0] + ok) + "," + selection2[1]
                    + " " + selection2[0] + "," + selection2[1] + " ";
                else
                    temp += selection1[0] + "," + selection1[1] + " " + selection1[0] + "," + selection2[1]
                    + " " + selection2[0] + "," + selection2[1] + " ";
            }
        }
        else if (position1 == 3 && position2 == 1) {
            if (selection1[0] - selection2[0] <= -80) {
                if (selection1[1] - selection2[1] < 40)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                   + " " + (selection1[0] + c1) + "," + (selection2[1] + ok) + " " + selection2[0] + "," + (selection2[1] + ok)
                   + " " + selection2[0] + "," + selection2[1] + " ";
                else
                    temp += selection1[0] + "," + selection1[1] + " " + selection2[0] + "," + selection1[1]
                        + " " + selection2[0] + "," + selection2[1] + " ";
            }
            else if (selection1[0] - selection2[0] < 72.5) {
                document.getElementById("test").innerHTML += "POINT x";
                if (selection1[1] - selection2[1] < 60)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] + cizgi2) + "," + selection1[1]
                    + " " + (selection2[0] + cizgi2) + "," + (selection2[1] + ok) + " " + selection2[0] + "," + (selection2[1] + ok)
                    + " " + selection2[0] + "," + selection2[1] + " ";
                else {
                    if (selection1[0] - selection2[0] > -10)
                        temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                        + " " + (selection1[0] + c1) + "," + (selection2[1] + ok) + " " + selection2[0] + "," + (selection2[1] + ok)
                        + " " + selection2[0] + "," + selection2[1] + " ";
                    else
                        temp += selection1[0] + "," + selection1[1] + " " + selection2[0] + "," + selection1[1]
                        + " " + selection2[0] + "," + selection2[1];
                }
            }
            else {
                if (selection1[1] - selection2[1] < 5)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                    + " " + (selection1[0] + c1) + "," + (selection2[1] + ok) + " " + selection2[0] + "," + (selection2[1] + ok)
                    + " " + selection2[0] + "," + selection2[1];
                else if (selection1[1] - selection2[1] < 60)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                    + " " + (selection1[0] + c1) + "," + (selection1[1] + dik1) + " " + selection2[0] + "," + (selection1[1] + dik1)
                    + " " + selection2[0] + "," + selection2[1];
                else
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                    + " " + (selection1[0] + c1) + "," + (selection1[1] - dik1) + " " + selection2[0] + "," + (selection1[1] - dik1)
                    + " " + selection2[0] + "," + selection2[1];
            }
        }
        else if (position1 == 2 && position2 == 3) {
            if (selection1[0] - selection2[0] < -95) {
                if (selection1[1] - selection2[1] > 0 && selection1[1] - selection2[1] <= 70)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - 10) + "," + selection1[1]
                    + " " + (selection1[0] - 10) + "," + (selection2[1] - dik1) + " " + (selection2[0] + ok) + "," + (selection2[1] - dik1)
                    + " " + (selection2[0] + ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                else
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - 10) + "," + selection1[1]
                    + " " + (selection1[0] - 10) + "," + (selection1[1] - dik1) + " " + (selection2[0] + ok) + "," + (selection1[1] - dik1)
                    + " " + (selection2[0] + ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
            }
            else if (selection1[0] - selection2[0] < 40) {
                temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - 10) + "," + selection1[1]
                + " " + (selection1[0] - 10) + "," + (selection1[1] - dik1) + " " + (selection1[0] + 2 * cizgi1 - 2 * c1) + "," + (selection1[1] - dik1)
                + " " + (selection1[0] + 2 * cizgi1 - 2 * c1) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
            }
            else {
                temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] - 10) + "," + selection1[1]
                + " " + (selection1[0] - 10) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
            }
        }
        else if (position1 == 3 && position2 == 2) {
            if (selection1[0] - selection2[0] > -50) {
                if (selection1[1] - selection2[1] < -70) {
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                    + " " + (selection1[0] + 10) + "," + (selection1[1] + dik1) + " " + (selection2[0] - ok) + "," + (selection1[1] + dik1)
                    + " " + (selection2[0] - ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                }
                else {
                    if (selection1[1] - selection2[1] > 0 && selection1[1] - selection2[1] < 70)
                        temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                        + " " + (selection1[0] + 10) + "," + (selection2[1] - dik1) + " " + (selection2[0] - ok) + "," + (selection2[1] - dik1)
                        + " " + (selection2[0] - ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                    else {
                        if (selection1[0] - selection2[0] > 95)
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                            + " " + (selection1[0] + 10) + "," + (selection1[1] - dik1) + " " + (selection2[0] - ok) + "," + (selection1[1] - dik1)
                            + " " + (selection2[0] - ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                        else
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                            + " " + (selection1[0] + 10) + "," + (selection1[1] - dik1) + " " + (selection1[0] - (2 * cizgi1 - 2 * c1)) + "," + (selection1[1] - dik1)
                            + " " + (selection1[0] - (2 * cizgi1 - 2 * c1)) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                    }

                }
            }
            else {
                temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                + " " + (selection1[0] + 10) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
            }
        }
        else if (position1 == 3 && position2 == 3) {
            if (selection1[1] - selection2[1] < -50) {
                if (selection1[0] - selection2[0] <= 30)
                    temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] + ok) + "," + selection1[1]
                    + " " + (selection2[0] + ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                else
                    temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                    + " " + (selection1[0] + c1) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
            }
            else {
                if (selection1[0] - selection2[0] <= 170) {
                    if (selection1[1] - selection2[1] > -40 && selection1[1] - selection2[1] < 40) {
                        if (selection1[0] - selection2[0] <= -150) {
                            if (selection1[1] - selection2[1] > 0)
                                temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                                + " " + (selection1[0] + 10) + "," + (selection2[1] - dik1) + " " + (selection2[0] + ok) + "," + (selection2[1] - dik1)
                                + " " + (selection2[0] + ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                            else
                                temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                                + " " + (selection1[0] + 10) + "," + (selection1[1] - dik1) + " " + (selection2[0] + ok) + "," + (selection1[1] - dik1)
                                + " " + (selection2[0] + ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                        }
                        else
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                            + " " + (selection1[0] + 10) + "," + (selection1[1] - dik1) + " " + (selection2[0] + ok) + "," + (selection1[1] - dik1)
                            + " " + (selection2[0] + ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                    }
                    else {
                        if (selection1[0] - selection2[0] < 40) {
                            temp += selection1[0] + "," + selection1[1] + " " + (selection2[0] + ok) + "," + selection1[1]
                            + " " + (selection2[0] + ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                        }
                        else {
                            temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                            + " " + (selection1[0] + c1) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                        }
                    }
                }
                else {
                    if (selection1[1] - selection2[1] > -40 && selection1[1] - selection2[1] < 40) {
                        temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + 10) + "," + selection1[1]
                        + " " + (selection1[0] + 10) + "," + (selection1[1] - dik1) + " " + (selection2[0] + ok) + "," + (selection1[1] - dik1)
                        + " " + (selection2[0] + ok) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                    }
                    else {
                        temp += selection1[0] + "," + selection1[1] + " " + (selection1[0] + c1) + "," + selection1[1]
                        + " " + (selection1[0] + c1) + "," + selection2[1] + " " + selection2[0] + "," + selection2[1];
                    }
                }

            }
        }
        else {
            document.getElementById("test").innerHTML += "Error";
            temp += selection1[0] + "," + selection1[1] + " " + selection2[0] + "," + selection2[1];
        }

        temp = findObjectArrayLineCollication(temp); //all objects        
        var temp2 = findLineArrayCollication(temp); //all lines 
        //document.getElementById("desc").innerHTML += "Burdayým <br />" + temp;

        this.LinesData = temp;

        if (temp2 != "") {
            //temp2 = "<defs><clipPath id=\"cut-off\">" + temp2 + "</clipPath></defs>";
            temp = polyline_start + " \"" + temp + "\" " + polyline_end.replace("black", this.stroke_color) + temp2;
        }
        else
            temp = polyline_start + " \"" + temp + "\" " + polyline_end.replace("black", this.stroke_color);

        if (this.text.length > 0) {
            var _mid_xy = this.findLongestLinePoint();
            temp += writeText(this.text, this.text_size, "normal", (_mid_xy[0] + 3), (_mid_xy[1] - 10), 30, _mid_xy[2], this.text_color);
        }

        var temp_end = "<g id=\"" + this.ID + "\" onclick=\"doClick_Line(evt)\" style=\"cursor:pointer\">";
        temp_end += temp;
        temp_end += "</g>";

        return temp_end;
    }

    this.findLongestLinePoint = function () {
        var line_arrayx = this.LinesData.split(" ");

        var _len = 0;
        var _mid_x = 0;
        var _mid_y = 0;
        var _align = "center";
        for (var i = 0; i < line_arrayx.length - 1; i++) {
            var linex_start = line_arrayx[i].split(",");
            var linex_end = line_arrayx[i + 1].split(",");
            var x1 = Math.round(linex_start[0] * 100) / 100;
            var y1 = Math.round(linex_start[1] * 100) / 100;
            var x2 = Math.round(linex_end[0] * 100) / 100;
            var y2 = Math.round(linex_end[1] * 100) / 100;
            var _dif = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
            if (_dif > _len) {
                //document.getElementById("test").innerHTML += "x1: " + x1 + " - x2: " + x2 + " ----- y1: " + y1 + " - y2: " + y2 + "<br>";
                _mid_x = (x1 + x2) / 2;
                _mid_y = (y1 + y2) / 2;
                if (y1 == y2)
                    _align = "center";
                else
                    _align = "";
                _len = _dif;
            }
        }
        return [_mid_x, _mid_y, _align, _align];
    }
}

function doClick_Line(evt) {
    //paint all svg rects and polylines with their selected colors...
    var theSvg = document.getElementById("demo");
    var theLines = theSvg.getElementsByTagName("polyline");

    for (var i = 0; i < theLines.length; i++) {
        if (theLines[i].parentNode.getAttribute("id").indexOf("Line_") != -1) {
            var theID = theLines[i].parentElement.getAttribute('id');
            var theID_int = parseInt(theID.substring(5));
            var theLine = line_array[theID_int - 1];
            theLines[i].setAttribute("style", "fill:none;stroke:" + theLine.stroke_color + ";stroke-width:2");
            theLines[i].setAttribute("marker-end", "url(#arrow)");
        }
    }

    var theTags = ["rect", "polygon", "path", "circle", "line"];
    for (var j = 0; j < theTags.length; j++) {
        var theTag = theSvg.getElementsByTagName(theTags[j]);
        for (var i = 0; i < theTag.length; i++) {
            if (theTag[i].parentNode.getAttribute("id").indexOf("Object_") != -1) {
                var theID = theTag[i].parentElement.getAttribute('id');
                var theID_int = parseInt(theID.substring(7));
                var theObjectx = object_array[theID_int - 1];
                if (theTags[j] != "Line")
                    theTag[i].setAttribute("style", "fill:" + theObjectx.fill_color + ";stroke:" + theObjectx.stroke_color + ";stroke-width:2");
                else
                    theLines[i].setAttribute("style", "stroke:" + theObjectx.stroke_color + ";stroke-width:2");
            }
        }
    }

    var theLine = evt.target.parentElement.children;
    if (theLine[0].nodeName == "tspan")
        theLine = evt.target.parentElement.parentElement.children; //tspan etiketine týklarsa, parent iki üstte
    if (theLine[0].nodeName == "polyline") {
        theLine[0].setAttribute("style", "fill:none;stroke:" + highlight_color + ";stroke-width:3");
        theLine[0].setAttribute("marker-end", "url(#arrow2)");
        var theID = theLine[0].parentElement.getAttribute('id');
        var theID_int = parseInt(theID.substring(5));
        var theLine = line_array[theID_int - 1];
        var temp = theLine.ID + " - " + theLine.Name + "\n";
        temp += theLine.LinesData;

        writeConsoleText(temp, "information");
        document.getElementById(id_theDesc).innerHTML = theLine.description; //desc
    }

}

function Connect_Two_Objects(object1, object2) {
    this.o1_probable_x_y = object1.probable_x_y;
    this.o2_probable_x_y = object2.probable_x_y;
    this.o1_points = object1.points;
    this.o2_points = object2.points;

    //find the best positions 
    dif = 10000000;
    position1 = -1;
    position2 = -1;

    for (var i = 0; i < this.o1_probable_x_y.length; i++) {
        for (var j = 0; j < this.o2_probable_x_y.length; j++) {
            if (this.o1_points[i] == false && this.o2_points[j] == false) {
                //Hypotenuse Calculate
                x_dif = this.o1_probable_x_y[i][0] - this.o2_probable_x_y[j][0];
                y_dif = this.o1_probable_x_y[i][1] - this.o2_probable_x_y[j][1];
                yeni_dif = Math.sqrt(x_dif * x_dif + y_dif * y_dif);
                //Change selection of objects
                if (yeni_dif < dif) {
                    dif = yeni_dif;
                    position1 = i;
                    position2 = j;
                }//if points are not used
            }//if
        }//for object2
    }//for object1

    //set position information
    if (position1 != -1 && position2 != -1) {
        return [position1, position2];
    }

    return null;
}

function free_draw(str, start_position, _stroke_color) {
    var x = start_position[0];
    var y = start_position[1];
    var res = str.split(" ");
    var _l = new Line();
    
    if (typeof _stroke_color === 'undefined' || _stroke_color == null)
        _stroke_color = "black";

    //d140 r120 u80 l60
    //d: down - to bottom, u: up - to top, r: right, l: left 
    var temp = x + "," + y + " ";
    
    for (i = 0; i < res.length; i++) {
        _error = false;
        if (res[i].substring(0, 1) == "d")
            y += parseInt(res[i].substring(1));
        else if (res[i].substring(0, 1) == "u")
            y -= parseInt(res[i].substring(1));
        else if (res[i].substring(0, 1) == "r")
            x += parseInt(res[i].substring(1));
        else if (res[i].substring(0, 1) == "l")
            x -= parseInt(res[i].substring(1));
        else
            _error = true;

        if (!_error)
            temp += x + "," + y + " ";
    }
    temp = temp.trim();
    temp = findObjectArrayLineCollication(temp);
    
    var temp2 = findLineArrayCollication(temp);    
    var temp3 = "";
    if (temp2 != "") {
        temp3 = polyline_start + " \"" + temp + "\" " + polyline_end.replace("black", _stroke_color) + temp2;
    }
    else
        temp3 = polyline_start + " \"" + temp + "\" " + polyline_end.replace("black", _stroke_color);

    _l.ID = "Line_" + (line_array.length);
    _l.LinesData = temp;
    line_array.push(_l);
    document.getElementById(id_theSVG).innerHTML += temp3;    
}

function free_write(_text, _text_size, _font_weight, _middle_x, _middle_y, _height, _align, _text_color) {
    var temp = writeText(_text, _text_size, _font_weight, _middle_x, _middle_y, _height, _align, _text_color);
    document.getElementById(id_theSVG).innerHTML += temp;
}

////Collision
function findLineCollication(x1, y1, x2, y2, x3, y3, x4, y4) {
    //for big number problem
    x1 = Math.round(x1 * 100) / 100;
    x2 = Math.round(x2 * 100) / 100;
    x3 = Math.round(x3 * 100) / 100;
    x4 = Math.round(x4 * 100) / 100;
    y1 = Math.round(y1 * 100) / 100;
    y2 = Math.round(y2 * 100) / 100;
    y3 = Math.round(y3 * 100) / 100;
    y4 = Math.round(y4 * 100) / 100;

    var a1 = y2 - y1;
    var b1 = x1 - x2;
    var c1 = a1 * x1 + b1 * y1;
    var a2 = y4 - y3;
    var b2 = x3 - x4;
    var c2 = a2 * x3 + b2 * y3;
    var det = a1 * b2 - a2 * b1;

    if (det != 0) {
        var x = Math.round((b2 * c1 - b1 * c2) / det * 100) / 100;
        var y = Math.round((a1 * c2 - a2 * c1) / det * 100) / 100;

        var minx12 = Math.min(x1, x2); var maxx12 = Math.max(x1, x2);
        if ((maxx12 - minx12) >= 6) { minx12 += 3; maxx12 -= 3; }
        var minx34 = Math.min(x3, x4); var maxx34 = Math.max(x3, x4);
        if ((maxx34 - minx34) >= 6) { minx34 += 3; maxx34 -= 3; }
        var miny12 = Math.min(y1, y2); var maxy12 = Math.max(y1, y2);
        if ((maxy12 - miny12) >= 6) { miny12 += 3; maxy12 -= 3; }
        var miny34 = Math.min(y3, y4); var maxy34 = Math.max(y3, y4);
        if ((maxy34 - miny34) >= 6) { miny34 += 3; maxy34 -= 3; }


        if (x >= minx12  && x <= maxx12
           && x >= minx34 && x <= maxx34
           && y >= miny12 && y <= maxy12
           && y >= miny34 && y <= maxy34) {
            return [x, y];
        }
    }

    return null;
}

    function findObjectCollication(object1, object2) {
        var o1_lines = [[object1.start_x - 40, object1.start_y - 40, object1.start_x + object1.width + 40, object1.start_y - 40],
                    [object1.start_x - 40, object1.start_y - 40, object1.start_x - 40, object1.start_y + object1.height + 40],
                    [object1.start_x + object1.width + 40, object1.start_y - 40, object1.start_x + object1.width + 40, object1.start_y + object1.height + 40],
                    [object1.start_x - 40, object1.start_y + object1.height + 40, object1.start_x + object1.width + 40, object1.start_y + object1.height + 40]];
        var o2_lines = [[object2.start_x, object2.start_y, object2.start_x + object2.width, object2.start_y],
                    [object2.start_x, object2.start_y, object2.start_x, object2.start_y + object2.height],
                    [object2.start_x + object2.width, object2.start_y, object2.start_x + object2.width, object2.start_y + object2.height],
                    [object2.start_x, object2.start_y + object2.height, object2.start_x + object2.width, object2.start_y + object2.height]];

        var result = false;
        for (var i = 0; i < o1_lines.length; i++) {
            for (var j = 0; j < o2_lines.length; j++) {
                var result = findLineCollication(o1_lines[i][0], o1_lines[i][1], o1_lines[i][2], o1_lines[i][3], o2_lines[j][0], o2_lines[j][1], o2_lines[j][2], o2_lines[j][3]);
                if (result != null) {
                    return true;
                }
            }
        }

        return result;
    }

    function findObjectArrayLineCollication(LinesData) {
        for (var i = 0; i < object_array.length; i++) {
            var line_arrayx = LinesData.split(" ");
            var objectx = object_array[i];
            var ox_lines = [[objectx.start_x, objectx.start_y, objectx.start_x + objectx.width, objectx.start_y],
                    [objectx.start_x, objectx.start_y + objectx.height, objectx.start_x + objectx.width, objectx.start_y + objectx.height],
                    [objectx.start_x, objectx.start_y, objectx.start_x, objectx.start_y + objectx.height],
                    [objectx.start_x + objectx.width, objectx.start_y, objectx.start_x + objectx.width, objectx.start_y + objectx.height]];

            var path = "";
            var x1 = -1, y1 = -1, x2 = -1, y2 = -1;
            var col_start = -1, col_end = -1;
            var min_x = 0, min_y = 0;

            for (var j = 0; j < line_arrayx.length - 1; j++) {
                var linex_start = line_arrayx[j].split(",");
                var linex_end = line_arrayx[j + 1].split(",");
                for (var m = 0; m < ox_lines.length; m++) {
                    var result = findLineCollication(ox_lines[m][0], ox_lines[m][1], ox_lines[m][2], ox_lines[m][3], linex_start[0], linex_start[1], linex_end[0], linex_end[1]);

                    if (result != null) {
                        if (i == 0) path += "t";
                        else if (i == 1) path += "b";
                        else if (i == 2) path += "l";
                        else if (i == 3) path += "r";

                        if (x1 == -1) { //first 
                            x1 = parseFloat(result[0]);
                            y1 = parseFloat(result[1]);
                            col_start = j + 1;
                            if (x1 - objectx.start_x < objectx.start_x + objectx.width - x1)
                                min_x = x1 - (objectx.start_x - 15); //to left
                            else
                                min_x = -(objectx.start_x + objectx.width - x1 + 15) //to right

                            if (y1 - objectx.start_y < objectx.start_y + objectx.height - y1)
                                min_y = y1 - (objectx.start_y - 15); //to top
                            else
                                min_y = -(objectx.start_y + objectx.height - y1 + 15) //to bottom

                        } else if (x2 == -1) { //second collision
                            x2 = parseFloat(result[0]);
                            y2 = parseFloat(result[1]);
                            if (path == "lr" && (linex_start[0] > linex_end[0])) {
                                path = "rl"; var _d = x1; x1 = x2; x2 = _d;
                            }
                            else if (path == "tb" && (linex_start[1] < linex_end[1])) {
                                path = "bt"; var _d = y1; y1 = y2; y2 = _d;
                            }
                            col_end = j + 1;
                            break;
                        }
                    }
                } //all lines in objects                   
            }//lines


            var temp = "";
            if (col_start != -1 && col_end != -1) {

                //temp = line_arrayx[0] + " ";
                for (var j = 0; j < line_arrayx.length; j++) {
                    //var linex_start = line_arrayx[j].split(",");
                    if (j < col_start || j > col_end) {
                        temp += line_arrayx[j] + " ";
                    }
                    else {
                        //document.getElementById("test").innerHTML += path + "<br>";
                        if (j == col_end) { //for only one replay     
                            path = path.substring(0, 2);//bug

                            if (path == "rb")
                                temp += (x1 + 15) + "," + y1 + " " + (x1 + 15) + "," + (y2 + 15) + " " + x2 + "," + (y2 + 15) + " " + line_arrayx[j] + " ";
                            else if (path == "br")
                                temp += x1 + "," + (y1 + 15) + " " + (x2 + 15) + "," + (y1 + 15) + " " + (x2 + 15) + "," + y2 + " " + line_arrayx[j] + " ";
                            else if (path == "rt")
                                temp += (x1 + 15) + "," + y1 + " " + (x1 + 15) + "," + (y2 - 15) + " " + x2 + "," + (y2 - 15) + " " + line_arrayx[j] + " ";
                            else if (path == "tr")
                                temp += x1 + "," + (y1 - 15) + " " + (x2 + 15) + "," + (y1 - 15) + " " + (x2 + 15) + "," + y2 + " " + line_arrayx[j] + " ";
                            else if (path == "lb")
                                temp += (x1 - 15) + "," + y1 + " " + (x1 - 15) + "," + (y2 + 15) + " " + x2 + "," + (y2 + 15) + " " + line_arrayx[j] + " ";
                            else if (path == "bl")
                                temp += x1 + "," + (y1 + 15) + " " + (x2 - 15) + "," + (y1 + 15) + " " + (x2 - 15) + "," + y2 + " " + line_arrayx[j] + " ";
                            else if (path == "lt")
                                temp += (x1 - 15) + "," + y1 + " " + (x1 - 15) + "," + (y2 - 15) + " " + x2 + "," + (y2 - 15) + " " + line_arrayx[j] + " ";
                            else if (path == "tl")
                                temp += x1 + "," + (y1 - 15) + " " + (x2 - 15) + "," + (y1 - 15) + " " + (x2 - 15) + "," + y2 + " " + line_arrayx[j] + " ";
                            else if (path == "tb")
                                temp += x1 + "," + (y1 - 15) + " " + (x2 - min_x) + "," + (y1 - 15) + " " + (x2 - min_x) + "," + (y2 + 15) + " " + x2 + "," + (y2 + 15) + " " + line_arrayx[j] + " ";
                            else if (path == "bt")
                                temp += x1 + "," + (y1 + 15) + " " + (x2 - min_x) + "," + (y1 + 15) + " " + (x2 - min_x) + "," + (y2 - 15) + " " + x2 + "," + (y2 - 15) + " " + line_arrayx[j] + " ";
                            else if (path == "lr")
                                temp += (x1 - 15) + "," + y1 + " " + (x1 - 15) + "," + (y1 - min_y) + " " + (x2 + 15) + "," + (y2 - min_y) + " " + (x2 + 15) + "," + y2 + " " + line_arrayx[j] + " ";
                            else if (path == "rl")
                                temp += (x1 + 15) + "," + y1 + " " + (x1 + 15) + "," + (y1 - min_y) + " " + (x2 - 15) + "," + (y2 - min_y) + " " + (x2 - 15) + "," + y2 + " " + line_arrayx[j] + " ";
                        }
                    }
                }
                LinesData = temp;
            }
        }

        return LinesData;
    }

    function findLineArrayCollication(LinesData) {
        var line_array1 = LinesData.split(" ");

        var temp2 = "";
        for (var i = 0; i < line_array.length; i++) {
            var line_array2 = line_array[i].LinesData.split(" ");
            var line1_start = line_array1[0].split(",");

            for (n = 0; n < line_array2.length - 1; n++) {
                var line2_start = line_array2[n].split(",");
                var line2_end = line_array2[n + 1].split(",");

                for (var m = 0; m < line_array1.length - 1; m++) {
                    line1_start = line_array1[m].split(",");
                    var line1_end = line_array1[m + 1].split(",");

                    var result = findLineCollication(line1_start[0], line1_start[1], line1_end[0], line1_end[1], line2_start[0], line2_start[1], line2_end[0], line2_end[1]);

                    if (result != null) {
                        var x_k = parseFloat(result[0]);
                        var y_k = parseFloat(result[1]);

                        if (line1_start[0] == line1_end[0]) //y
                        {
                            temp2 += "<line x1=\"" + line1_start[0] + "\" y1=\"" + (y_k - 5) + "\" x2=\"" + line1_start[0] + "\" y2=\"" + (y_k - 1.5) + "\" stroke=\"white\" stroke-width=\"4\"/>";
                            temp2 += "<line x1=\"" + line1_start[0] + "\" y1=\"" + (y_k + 5) + "\" x2=\"" + line1_start[0] + "\" y2=\"" + (y_k + 1.5) + "\" stroke=\"white\"  stroke-width=\"4\" />";
                            temp2 += "<defs><clipPath id=\"cut-off-" + x_k + "-" + y_k + "\">";
                            temp2 += "<rect class=\"closed\" x=\"" + (x_k - 15) + "\" y=\"" + (y_k - 15) + "\" width=\"15\" height=\"30\" />";
                            temp2 += "</clipPath></defs>";
                            temp2 += "<circle cx=\"" + x_k + "\" cy=\"" + y_k + "\" r=\"7\" stroke-width=\"3\" stroke=\"black\" fill-opacity=\"0\" fill=\"white\" clip-path=\"url(#cut-off-" + x_k + "-" + y_k + ")\"/>";
                        } else if (line1_start[1] == line1_end[1]) {
                            temp2 += "<line x1=\"" + (x_k - 5) + "\" y1=\"" + line1_start[1] + "\" x2=\"" + (x_k - 1.5) + "\" y2=\"" + line1_start[1] + "\" stroke=\"white\" stroke-width=\"4\" />";
                            temp2 += "<line x1=\"" + (x_k + 5) + "\" y1=\"" + line1_start[1] + "\" x2=\"" + (x_k + 1.5) + "\" y2=\"" + line1_start[1] + "\" stroke=\"white\"  stroke-width=\"4\" />";
                            temp2 += "<defs><clipPath id=\"cut-off-" + x_k + "-" + y_k + "\">";
                            temp2 += "<rect class=\"closed\" x=\"" + (x_k - 15) + "\" y=\"" + (y_k - 15) + "\" width=\"30\" height=\"15\" />";
                            temp2 += "</clipPath></defs>";
                            temp2 += "<circle cx=\"" + x_k + "\" cy=\"" + y_k + "\" r=\"7\" stroke-width=\"3\" stroke=\"black\" fill-opacity=\"0\" fill=\"white\" clip-path=\"url(#cut-off-" + x_k + "-" + y_k + ")\"/>";
                        }
                        //çakýþma var
                    }
                }//                       
            }
        }//all lines

        return temp2;
    }

    function add_theObject(theObject) {
        var col_error = false;
        for (var i = 0; i < object_array.length; i++) {
            if (findObjectCollication(theObject, object_array[i])) {
                col_error = true;
                break;
            }
        }

        if (!col_error) {
            theObject.ID = "Object_" + (object_array.length + 1);
            document.getElementById(id_theSVG).innerHTML += theObject.Draw();
            object_array.push(theObject);        
            return theObject;
        }
        else
            writeConsoleText("Object collision error / Objects are too close (min 40 px)", "warning");

        return null;
    }

    function draw_theLine(theLine) {
        theLine.ID = "Line_" + (line_array.length + 1);
        document.getElementById(id_theSVG).innerHTML += theLine.Draw();
        line_array.push(theLine);

        return theLine;
    }

