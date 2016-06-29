import {AttributesBuffer}			from "@awayjs/core/lib/attributes/AttributesBuffer";
import {AttributesView}				from "@awayjs/core/lib/attributes/AttributesView";
import {Float2Attributes}			from "@awayjs/core/lib/attributes/Float2Attributes";
import {Byte4Attributes}			from "@awayjs/core/lib/attributes/Byte4Attributes";
import {Matrix3D}					from "@awayjs/core/lib/geom/Matrix3D";
import {Matrix}						from "@awayjs/core/lib/geom/Matrix";
import {ColorTransform}				from "@awayjs/core/lib/geom/ColorTransform";
import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";
import {Vector3D}					from "@awayjs/core/lib/geom/Vector3D";
import {Sampler2D}					from "@awayjs/core/lib/image/Sampler2D";

import {HierarchicalProperties}		from "../base/HierarchicalProperties";
import {Style}						from "../base/Style";
import {DisplayObject}				from "../display/DisplayObject";
import {AntiAliasType}				from "../text/AntiAliasType";
import {GridFitType}				from "../text/GridFitType";
import {TextFieldAutoSize}			from "../text/TextFieldAutoSize";
import {TextFieldType}				from "../text/TextFieldType";
import {TextFormat}					from "../text/TextFormat";
import {TextInteractionMode}		from "../text/TextInteractionMode";
import {TextLineMetrics}			from "../text/TextLineMetrics";
import {Sprite}						from "../display/Sprite";
import {Graphics}					from "../graphics/Graphics";
import {Graphic}					from "../graphics/Graphic";
import {ElementsBase}				from "../graphics/ElementsBase";
import {TriangleElements}			from "../graphics/TriangleElements";
import {TesselatedFontChar}			from "../text/TesselatedFontChar";
import {TextFormatAlign}			from "../text/TextFormatAlign";
import {TesselatedFontTable}		from "../text/TesselatedFontTable";
import {DisplayObjectContainer}		from "../display/DisplayObjectContainer";
import {DefaultMaterialManager}		from "../managers/DefaultMaterialManager";

/**
 * The TextField class is used to create display objects for text display and
 * input. <ph outputclass="flexonly">You can use the TextField class to
 * perform low-level text rendering. However, in Flex, you typically use the
 * Label, Text, TextArea, and TextInput controls to process text. <ph
 * outputclass="flashonly">You can give a text field an instance name in the
 * Property inspector and use the methods and properties of the TextField
 * class to manipulate it with ActionScript. TextField instance names are
 * displayed in the Movie Explorer and in the Insert Target Path dialog box in
 * the Actions panel.
 *
 * <p>To create a text field dynamically, use the <code>TextField()</code>
 * constructor.</p>
 *
 * <p>The methods of the TextField class let you set, select, and manipulate
 * text in a dynamic or input text field that you create during authoring or
 * at runtime. </p>
 *
 * <p>ActionScript provides several ways to format your text at runtime. The
 * TextFormat class lets you set character and paragraph formatting for
 * TextField objects. You can apply Cascading Style Sheets(CSS) styles to
 * text fields by using the <code>TextField.styleSheet</code> property and the
 * StyleSheet class. You can use CSS to style built-in HTML tags, define new
 * formatting tags, or apply styles. You can assign HTML formatted text, which
 * optionally uses CSS styles, directly to a text field. HTML text that you
 * assign to a text field can contain embedded media(movie clips, SWF files,
 * GIF files, PNG files, and JPEG files). The text wraps around the embedded
 * media in the same way that a web browser wraps text around media embedded
 * in an HTML document. </p>
 *
 * <p>Flash Player supports a subset of HTML tags that you can use to format
 * text. See the list of supported HTML tags in the description of the
 * <code>htmlText</code> property.</p>
 * 
 * @event change                    Dispatched after a control value is
 *                                  modified, unlike the
 *                                  <code>textInput</code> event, which is
 *                                  dispatched before the value is modified.
 *                                  Unlike the W3C DOM Event Model version of
 *                                  the <code>change</code> event, which
 *                                  dispatches the event only after the
 *                                  control loses focus, the ActionScript 3.0
 *                                  version of the <code>change</code> event
 *                                  is dispatched any time the control
 *                                  changes. For example, if a user types text
 *                                  into a text field, a <code>change</code>
 *                                  event is dispatched after every keystroke.
 * @event link                      Dispatched when a user clicks a hyperlink
 *                                  in an HTML-enabled text field, where the
 *                                  URL begins with "event:". The remainder of
 *                                  the URL after "event:" is placed in the
 *                                  text property of the LINK event.
 *
 *                                  <p><b>Note:</b> The default behavior,
 *                                  adding the text to the text field, occurs
 *                                  only when Flash Player generates the
 *                                  event, which in this case happens when a
 *                                  user attempts to input text. You cannot
 *                                  put text into a text field by sending it
 *                                  <code>textInput</code> events.</p>
 * @event scroll                    Dispatched by a TextField object
 *                                  <i>after</i> the user scrolls.
 * @event textInput                 Flash Player dispatches the
 *                                  <code>textInput</code> event when a user
 *                                  enters one or more characters of text.
 *                                  Various text input methods can generate
 *                                  this event, including standard keyboards,
 *                                  input method editors(IMEs), voice or
 *                                  speech recognition systems, and even the
 *                                  act of pasting plain text with no
 *                                  formatting or style information.
 * @event textInteractionModeChange Flash Player dispatches the
 *                                  <code>textInteractionModeChange</code>
 *                                  event when a user changes the interaction
 *                                  mode of a text field. for example on
 *                                  Android, one can toggle from NORMAL mode
 *                                  to SELECTION mode using context menu
 *                                  options
 */
export class TextField extends Sprite
{
	private static _textFields:Array<TextField> = new Array<TextField>();

	public static assetType:string = "[asset TextField]";

	private _textGraphicsDirty:boolean;
	private _bottomScrollV:number;
	private _caretIndex:number;
	private _length:number;
	private _maxScrollH:number;
	private _maxScrollV:number;
	private _numLines:number;
	private _selectionBeginIndex:number;
	private _selectionEndIndex:number;
	private _text:string = "";
	private _textHeight:number;
	private _textInteractionMode:TextInteractionMode;
	private _textWidth:number;

	private _charBoundaries:Rectangle;
	private _charIndexAtPoint:number;
	private _firstCharInParagraph:number;
	private _imageReference:DisplayObject
	private _lineIndexAtPoint:number;
	private _lineIndexOfChar:number;
	private _lineLength:number;
	private _lineMetrics:TextLineMetrics;
	private _lineOffset:number;
	private _lineText:string;
	private _paragraphLength:number;
	private _textFormat:TextFormat;
	private _textElements:TriangleElements;
	private _textGraphic:Graphic;

	/**
	 * When set to <code>true</code> and the text field is not in focus, Flash
	 * Player highlights the selection in the text field in gray. When set to
	 * <code>false</code> and the text field is not in focus, Flash Player does
	 * not highlight the selection in the text field.
	 * 
	 * @default false
	 */
	public alwaysShowSelection:boolean;

	/**
	 * The type of anti-aliasing used for this text field. Use
	 * <code>flash.text.AntiAliasType</code> constants for this property. You can
	 * control this setting only if the font is embedded(with the
	 * <code>embedFonts</code> property set to <code>true</code>). The default
	 * setting is <code>flash.text.AntiAliasType.NORMAL</code>.
	 *
	 * <p>To set values for this property, use the following string values:</p>
	 */
	public antiAliasType:AntiAliasType;

	/**
	 * Controls automatic sizing and alignment of text fields. Acceptable values
	 * for the <code>TextFieldAutoSize</code> constants:
	 * <code>TextFieldAutoSize.NONE</code>(the default),
	 * <code>TextFieldAutoSize.LEFT</code>, <code>TextFieldAutoSize.RIGHT</code>,
	 * and <code>TextFieldAutoSize.CENTER</code>.
	 *
	 * <p>If <code>autoSize</code> is set to <code>TextFieldAutoSize.NONE</code>
	 * (the default) no resizing occurs.</p>
	 *
	 * <p>If <code>autoSize</code> is set to <code>TextFieldAutoSize.LEFT</code>,
	 * the text is treated as left-justified text, meaning that the left margin
	 * of the text field remains fixed and any resizing of a single line of the
	 * text field is on the right margin. If the text includes a line break(for
	 * example, <code>"\n"</code> or <code>"\r"</code>), the bottom is also
	 * resized to fit the next line of text. If <code>wordWrap</code> is also set
	 * to <code>true</code>, only the bottom of the text field is resized and the
	 * right side remains fixed.</p>
	 *
	 * <p>If <code>autoSize</code> is set to
	 * <code>TextFieldAutoSize.RIGHT</code>, the text is treated as
	 * right-justified text, meaning that the right margin of the text field
	 * remains fixed and any resizing of a single line of the text field is on
	 * the left margin. If the text includes a line break(for example,
	 * <code>"\n" or "\r")</code>, the bottom is also resized to fit the next
	 * line of text. If <code>wordWrap</code> is also set to <code>true</code>,
	 * only the bottom of the text field is resized and the left side remains
	 * fixed.</p>
	 *
	 * <p>If <code>autoSize</code> is set to
	 * <code>TextFieldAutoSize.CENTER</code>, the text is treated as
	 * center-justified text, meaning that any resizing of a single line of the
	 * text field is equally distributed to both the right and left margins. If
	 * the text includes a line break(for example, <code>"\n"</code> or
	 * <code>"\r"</code>), the bottom is also resized to fit the next line of
	 * text. If <code>wordWrap</code> is also set to <code>true</code>, only the
	 * bottom of the text field is resized and the left and right sides remain
	 * fixed.</p>
	 * 
	 * @throws ArgumentError The <code>autoSize</code> specified is not a member
	 *                       of flash.text.TextFieldAutoSize.
	 */
	public autoSize:TextFieldAutoSize;

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return TextField.assetType;
	}

	/**
	 * Specifies whether the text field has a background fill. If
	 * <code>true</code>, the text field has a background fill. If
	 * <code>false</code>, the text field has no background fill. Use the
	 * <code>backgroundColor</code> property to set the background color of a
	 * text field.
	 * 
	 * @default false
	 */
	public background:boolean;

	/**
	 * The color of the text field background. The default value is
	 * <code>0xFFFFFF</code>(white). This property can be retrieved or set, even
	 * if there currently is no background, but the color is visible only if the
	 * text field has the <code>background</code> property set to
	 * <code>true</code>.
	 */
	public backgroundColor:number /*int*/;

	/**
	 * Specifies whether the text field has a border. If <code>true</code>, the
	 * text field has a border. If <code>false</code>, the text field has no
	 * border. Use the <code>borderColor</code> property to set the border color.
	 * 
	 * @default false
	 */
	public border:boolean;

	/**
	 * The color of the text field border. The default value is
	 * <code>0x000000</code>(black). This property can be retrieved or set, even
	 * if there currently is no border, but the color is visible only if the text
	 * field has the <code>border</code> property set to <code>true</code>.
	 */
	public borderColor:number /*int*/;

	/**
	 * An integer(1-based index) that indicates the bottommost line that is
	 * currently visible in the specified text field. Think of the text field as
	 * a window onto a block of text. The <code>scrollV</code> property is the
	 * 1-based index of the topmost visible line in the window.
	 *
	 * <p>All the text between the lines indicated by <code>scrollV</code> and
	 * <code>bottomScrollV</code> is currently visible in the text field.</p>
	 */
	public get bottomScrollV():number /*int*/
	{
		return this._bottomScrollV;
	}

	/**
	 * The index of the insertion point(caret) position. If no insertion point
	 * is displayed, the value is the position the insertion point would be if
	 * you restored focus to the field(typically where the insertion point last
	 * was, or 0 if the field has not had focus).
	 *
	 * <p>Selection span indexes are zero-based(for example, the first position
	 * is 0, the second position is 1, and so on).</p>
	 */
	public get caretIndex():number /*int*/
	{
		return this._caretIndex;
	}

	/**
	 * A Boolean value that specifies whether extra white space(spaces, line
	 * breaks, and so on) in a text field with HTML text is removed. The default
	 * value is <code>false</code>. The <code>condenseWhite</code> property only
	 * affects text set with the <code>htmlText</code> property, not the
	 * <code>text</code> property. If you set text with the <code>text</code>
	 * property, <code>condenseWhite</code> is ignored.
	 *
	 * <p>If <code>condenseWhite</code> is set to <code>true</code>, use standard
	 * HTML commands such as <code><BR></code> and <code><P></code> to place line
	 * breaks in the text field.</p>
	 *
	 * <p>Set the <code>condenseWhite</code> property before setting the
	 * <code>htmlText</code> property.</p>
	 */
	public condenseWhite:boolean;

	/**
	 * Specifies the format applied to newly inserted text, such as text entered
	 * by a user or text inserted with the <code>replaceSelectedText()</code>
	 * method.
	 *
	 * <p><b>Note:</b> When selecting characters to be replaced with
	 * <code>setSelection()</code> and <code>replaceSelectedText()</code>, the
	 * <code>defaultTextFormat</code> will be applied only if the text has been
	 * selected up to and including the last character. Here is an example:</p>
	 * <pre xml:space="preserve"> public my_txt:TextField new TextField();
	 * my_txt.text = "Flash Macintosh version"; public my_fmt:TextFormat = new
	 * TextFormat(); my_fmt.color = 0xFF0000; my_txt.defaultTextFormat = my_fmt;
	 * my_txt.setSelection(6,15); // partial text selected - defaultTextFormat
	 * not applied my_txt.setSelection(6,23); // text selected to end -
	 * defaultTextFormat applied my_txt.replaceSelectedText("Windows version");
	 * </pre>
	 *
	 * <p>When you access the <code>defaultTextFormat</code> property, the
	 * returned TextFormat object has all of its properties defined. No property
	 * is <code>null</code>.</p>
	 *
	 * <p><b>Note:</b> You can't set this property if a style sheet is applied to
	 * the text field.</p>
	 * 
	 * @throws Error This method cannot be used on a text field with a style
	 *               sheet.
	 */
	public defaultTextFormat:TextFormat;

	/**
	 * Specifies whether the text field is a password text field. If the value of
	 * this property is <code>true</code>, the text field is treated as a
	 * password text field and hides the input characters using asterisks instead
	 * of the actual characters. If <code>false</code>, the text field is not
	 * treated as a password text field. When password mode is enabled, the Cut
	 * and Copy commands and their corresponding keyboard shortcuts will not
	 * function. This security mechanism prevents an unscrupulous user from using
	 * the shortcuts to discover a password on an unattended computer.
	 * 
	 * @default false
	 */
	public displayAsPassword:boolean;

	/**
	 * Specifies whether to render by using embedded font outlines. If
	 * <code>false</code>, Flash Player renders the text field by using device
	 * fonts.
	 *
	 * <p>If you set the <code>embedFonts</code> property to <code>true</code>
	 * for a text field, you must specify a font for that text by using the
	 * <code>font</code> property of a TextFormat object applied to the text
	 * field. If the specified font is not embedded in the SWF file, the text is
	 * not displayed.</p>
	 * 
	 * @default false
	 */
	public embedFonts:boolean;

	/**
	 * The type of grid fitting used for this text field. This property applies
	 * only if the <code>flash.text.AntiAliasType</code> property of the text
	 * field is set to <code>flash.text.AntiAliasType.ADVANCED</code>.
	 *
	 * <p>The type of grid fitting used determines whether Flash Player forces
	 * strong horizontal and vertical lines to fit to a pixel or subpixel grid,
	 * or not at all.</p>
	 *
	 * <p>For the <code>flash.text.GridFitType</code> property, you can use the
	 * following string values:</p>
	 * 
	 * @default pixel
	 */
	public gridFitType:GridFitType;

	/**
	 * Contains the HTML representation of the text field contents.
	 *
	 * <p>Flash Player supports the following HTML tags:</p>
	 *
	 * <p>Flash Player and AIR also support explicit character codes, such as
	 * &#38;(ASCII ampersand) and &#x20AC;(Unicode € symbol). </p>
	 */
	public htmlText:string;

	/**
	 * The number of characters in a text field. A character such as tab
	 * (<code>\t</code>) counts as one character.
	 */
	public get length():number /*int*/
	{
		return this._length;
	}

	/**
	 * The maximum number of characters that the text field can contain, as
	 * entered by a user. A script can insert more text than
	 * <code>maxChars</code> allows; the <code>maxChars</code> property indicates
	 * only how much text a user can enter. If the value of this property is
	 * <code>0</code>, a user can enter an unlimited amount of text.
	 * 
	 * @default 0
	 */
	public maxChars:number /*int*/;

	/**
	 * The maximum value of <code>scrollH</code>.
	 */
	public maxScrollH():number /*int*/
	{
		return this._maxScrollH;
	}

	/**
	 * The maximum value of <code>scrollV</code>.
	 */
	public maxScrollV():number /*int*/
	{
		return this._maxScrollV;
	}

	/**
	 * A Boolean value that indicates whether Flash Player automatically scrolls
	 * multiline text fields when the user clicks a text field and rolls the
	 * mouse wheel. By default, this value is <code>true</code>. This property is
	 * useful if you want to prevent mouse wheel scrolling of text fields, or
	 * implement your own text field scrolling.
	 */
	public mouseWheelEnabled:boolean;

	/**
	 * Indicates whether field is a multiline text field. If the value is
	 * <code>true</code>, the text field is multiline; if the value is
	 * <code>false</code>, the text field is a single-line text field. In a field
	 * of type <code>TextFieldType.INPUT</code>, the <code>multiline</code> value
	 * determines whether the <code>Enter</code> key creates a new line(a value
	 * of <code>false</code>, and the <code>Enter</code> key is ignored). If you
	 * paste text into a <code>TextField</code> with a <code>multiline</code>
	 * value of <code>false</code>, newlines are stripped out of the text.
	 * 
	 * @default false
	 */
	public multiline:boolean;

	/**
	 * Defines the number of text lines in a multiline text field. If
	 * <code>wordWrap</code> property is set to <code>true</code>, the number of
	 * lines increases when text wraps.
	 */
	public get numLines():number /*int*/
	{
		return this._numLines;
	}

	/**
	 * Indicates the set of characters that a user can enter into the text field.
	 * If the value of the <code>restrict</code> property is <code>null</code>,
	 * you can enter any character. If the value of the <code>restrict</code>
	 * property is an empty string, you cannot enter any character. If the value
	 * of the <code>restrict</code> property is a string of characters, you can
	 * enter only characters in the string into the text field. The string is
	 * scanned from left to right. You can specify a range by using the hyphen
	 * (-) character. Only user interaction is restricted; a script can put any
	 * text into the text field. <ph outputclass="flashonly">This property does
	 * not synchronize with the Embed font options in the Property inspector.
	 *
	 * <p>If the string begins with a caret(^) character, all characters are
	 * initially accepted and succeeding characters in the string are excluded
	 * from the set of accepted characters. If the string does not begin with a
	 * caret(^) character, no characters are initially accepted and succeeding
	 * characters in the string are included in the set of accepted
	 * characters.</p>
	 *
	 * <p>The following example allows only uppercase characters, spaces, and
	 * numbers to be entered into a text field:</p>
	 * <pre xml:space="preserve"> my_txt.restrict = "A-Z 0-9"; </pre>
	 *
	 * <p>The following example includes all characters, but excludes lowercase
	 * letters:</p>
	 * <pre xml:space="preserve"> my_txt.restrict = "^a-z"; </pre>
	 *
	 * <p>You can use a backslash to enter a ^ or - verbatim. The accepted
	 * backslash sequences are \-, \^ or \\. The backslash must be an actual
	 * character in the string, so when specified in ActionScript, a double
	 * backslash must be used. For example, the following code includes only the
	 * dash(-) and caret(^):</p>
	 * <pre xml:space="preserve"> my_txt.restrict = "\\-\\^"; </pre>
	 *
	 * <p>The ^ can be used anywhere in the string to toggle between including
	 * characters and excluding characters. The following code includes only
	 * uppercase letters, but excludes the uppercase letter Q:</p>
	 * <pre xml:space="preserve"> my_txt.restrict = "A-Z^Q"; </pre>
	 *
	 * <p>You can use the <code>\u</code> escape sequence to construct
	 * <code>restrict</code> strings. The following code includes only the
	 * characters from ASCII 32(space) to ASCII 126(tilde).</p>
	 * <pre xml:space="preserve"> my_txt.restrict = "\u0020-\u007E"; </pre>
	 * 
	 * @default null
	 */
	public restrict:string;

	/**
	 * The current horizontal scrolling position. If the <code>scrollH</code>
	 * property is 0, the text is not horizontally scrolled. This property value
	 * is an integer that represents the horizontal position in pixels.
	 *
	 * <p>The units of horizontal scrolling are pixels, whereas the units of
	 * vertical scrolling are lines. Horizontal scrolling is measured in pixels
	 * because most fonts you typically use are proportionally spaced; that is,
	 * the characters can have different widths. Flash Player performs vertical
	 * scrolling by line because users usually want to see a complete line of
	 * text rather than a partial line. Even if a line uses multiple fonts, the
	 * height of the line adjusts to fit the largest font in use.</p>
	 *
	 * <p><b>Note: </b>The <code>scrollH</code> property is zero-based, not
	 * 1-based like the <code>scrollV</code> vertical scrolling property.</p>
	 */
	public scrollH:number;

	/**
	 * The vertical position of text in a text field. The <code>scrollV</code>
	 * property is useful for directing users to a specific paragraph in a long
	 * passage, or creating scrolling text fields.
	 *
	 * <p>The units of vertical scrolling are lines, whereas the units of
	 * horizontal scrolling are pixels. If the first line displayed is the first
	 * line in the text field, scrollV is set to 1(not 0). Horizontal scrolling
	 * is measured in pixels because most fonts are proportionally spaced; that
	 * is, the characters can have different widths. Flash performs vertical
	 * scrolling by line because users usually want to see a complete line of
	 * text rather than a partial line. Even if there are multiple fonts on a
	 * line, the height of the line adjusts to fit the largest font in use.</p>
	 */
	public scrollV:number;

	/**
	 * A Boolean value that indicates whether the text field is selectable. The
	 * value <code>true</code> indicates that the text is selectable. The
	 * <code>selectable</code> property controls whether a text field is
	 * selectable, not whether a text field is editable. A dynamic text field can
	 * be selectable even if it is not editable. If a dynamic text field is not
	 * selectable, the user cannot select its text.
	 *
	 * <p>If <code>selectable</code> is set to <code>false</code>, the text in
	 * the text field does not respond to selection commands from the mouse or
	 * keyboard, and the text cannot be copied with the Copy command. If
	 * <code>selectable</code> is set to <code>true</code>, the text in the text
	 * field can be selected with the mouse or keyboard, and the text can be
	 * copied with the Copy command. You can select text this way even if the
	 * text field is a dynamic text field instead of an input text field. </p>
	 * 
	 * @default true
	 */
	public selectable:boolean;

	/**
	 * The zero-based character index value of the first character in the current
	 * selection. For example, the first character is 0, the second character is
	 * 1, and so on. If no text is selected, this property is the value of
	 * <code>caretIndex</code>.
	 */
	public get selectionBeginIndex():number /*int*/
	{
		return this._selectionBeginIndex;
	}

	/**
	 * The zero-based character index value of the last character in the current
	 * selection. For example, the first character is 0, the second character is
	 * 1, and so on. If no text is selected, this property is the value of
	 * <code>caretIndex</code>.
	 */
	public get selectionEndIndex():number /*int*/
	{
		return this._selectionEndIndex;
	}

	/**
	 * The sharpness of the glyph edges in this text field. This property applies
	 * only if the <code>flash.text.AntiAliasType</code> property of the text
	 * field is set to <code>flash.text.AntiAliasType.ADVANCED</code>. The range
	 * for <code>sharpness</code> is a number from -400 to 400. If you attempt to
	 * set <code>sharpness</code> to a value outside that range, Flash sets the
	 * property to the nearest value in the range(either -400 or 400).
	 * 
	 * @default 0
	 */
	public sharpness:number;

	/**
	 * Attaches a style sheet to the text field. For information on creating
	 * style sheets, see the StyleSheet class and the <i>ActionScript 3.0
	 * Developer's Guide</i>.
	 *
	 * <p>You can change the style sheet associated with a text field at any
	 * time. If you change the style sheet in use, the text field is redrawn with
	 * the new style sheet. You can set the style sheet to <code>null</code> or
	 * <code>undefined</code> to remove the style sheet. If the style sheet in
	 * use is removed, the text field is redrawn without a style sheet. </p>
	 *
	 * <p><b>Note:</b> If the style sheet is removed, the contents of both
	 * <code>TextField.text</code> and <code> TextField.htmlText</code> change to
	 * incorporate the formatting previously applied by the style sheet. To
	 * preserve the original <code>TextField.htmlText</code> contents without the
	 * formatting, save the value in a variable before removing the style
	 * sheet.</p>
	 */
	public styleSheet:StyleSheet;

	/**
	 * A string that is the current text in the text field. Lines are separated
	 * by the carriage return character(<code>'\r'</code>, ASCII 13). This
	 * property contains unformatted text in the text field, without HTML tags.
	 *
	 * <p>To get the text in HTML form, use the <code>htmlText</code>
	 * property.</p>
	 */
	public get text():string
	{
		return this._text;
	}

	public set text(value:string)
	{
		value = value.toString();

		if (this._text == value)
			return;

		this._text = value;

		this._textGraphicsDirty = true;
	}

	public get textFormat():TextFormat
	{
		return this._textFormat;
	}

	public set textFormat(value:TextFormat)
	{
		if (this._textFormat == value)
			return;

		this._textFormat = value;

		this._textGraphicsDirty = true;
	}


	/**
	 * The graphics used by the sprite that provides it with its shape.
	 */
	public get graphics():Graphics
	{
		if (this._textGraphicsDirty)
			this.reConstruct();

		return this._graphics;
	}

	/**
	 * The color of the text in a text field, in hexadecimal format. The
	 * hexadecimal color system uses six digits to represent color values. Each
	 * digit has 16 possible values or characters. The characters range from 0-9
	 * and then A-F. For example, black is <code>0x000000</code>; white is
	 * <code>0xFFFFFF</code>.
	 * 
	 * @default 0(0x000000)
	 */
	public _textColor:number /*int*/;

	public get textColor():number
	{
		return this._textColor;
	}

	public set textColor(value:number)
	{
		this._textColor = value;
		if(!this.transform.colorTransform)
			this.transform.colorTransform = new ColorTransform();

		this.transform.colorTransform.color = value;
		this.pInvalidateHierarchicalProperties(HierarchicalProperties.COLOR_TRANSFORM);
	}

	/**
	 * The interaction mode property, Default value is
	 * TextInteractionMode.NORMAL. On mobile platforms, the normal mode implies
	 * that the text can be scrolled but not selected. One can switch to the
	 * selectable mode through the in-built context menu on the text field. On
	 * Desktop, the normal mode implies that the text is in scrollable as well as
	 * selection mode.
	 */
	public get textInteractionMode():TextInteractionMode
	{
		return this._textInteractionMode;
	}

	/**
	 * The width of the text in pixels.
	 */
	public get textWidth():number
	{
		return this._textWidth;
	}

	public set textWidth(value:number)
	{
		this._textWidth = value;
	}

	/**
	 * The width of the text in pixels.
	 */
	public get textHeight():number
	{
		return this._textHeight;
	}

	public set textHeight(value:number)
	{
		this._textHeight = value;
	}
	/**
	 * The thickness of the glyph edges in this text field. This property applies
	 * only when <code>AntiAliasType</code> is set to
	 * <code>AntiAliasType.ADVANCED</code>.
	 *
	 * <p>The range for <code>thickness</code> is a number from -200 to 200. If
	 * you attempt to set <code>thickness</code> to a value outside that range,
	 * the property is set to the nearest value in the range(either -200 or
	 * 200).</p>
	 * 
	 * @default 0
	 */
	public thickness:number;

	/**
	 * The type of the text field. Either one of the following TextFieldType
	 * constants: <code>TextFieldType.DYNAMIC</code>, which specifies a dynamic
	 * text field, which a user cannot edit, or <code>TextFieldType.INPUT</code>,
	 * which specifies an input text field, which a user can edit.
	 * 
	 * @default dynamic
	 * @throws ArgumentError The <code>type</code> specified is not a member of
	 *                       flash.text.TextFieldType.
	 */
	public type:TextFieldType;

	/**
	 * Specifies whether to copy and paste the text formatting along with the
	 * text. When set to <code>true</code>, Flash Player copies and pastes
	 * formatting(such as alignment, bold, and italics) when you copy and paste
	 * between text fields. Both the origin and destination text fields for the
	 * copy and paste procedure must have <code>useRichTextClipboard</code> set
	 * to <code>true</code>. The default value is <code>false</code>.
	 */
	public useRichTextClipboard:boolean;

	/**
	 * A Boolean value that indicates whether the text field has word wrap. If
	 * the value of <code>wordWrap</code> is <code>true</code>, the text field
	 * has word wrap; if the value is <code>false</code>, the text field does not
	 * have word wrap. The default value is <code>false</code>.
	 */
	public wordWrap:boolean;


	/**
	 *
	 */
	public get isEntity():boolean
	{
		return true; //TODO do this better
	}

	/**
	 * Creates a new TextField instance. After you create the TextField instance,
	 * call the <code>addChild()</code> or <code>addChildAt()</code> method of
	 * the parent DisplayObjectContainer object to add the TextField instance to
	 * the display list.
	 *
	 * <p>The default size for a text field is 100 x 100 pixels.</p>
	 */
	constructor()
	{
		super();

		this.type = TextFieldType.STATIC;
	}

	public clear():void
	{
		super.clear();

		if (this._textElements)
			this._textElements.clear();
	}

	/**
	 * @inheritDoc
	 */
	public dispose():void
	{
		this.disposeValues();

		TextField._textFields.push(this);
	}

	/**
	 * @inheritDoc
	 */
	public disposeValues():void
	{
		super.disposeValues();

		this._textFormat = null;
		this._textGraphic = null;

		if (this._textElements) {
			this._textElements.dispose();
			this._textElements = null;
		}
	}

	/**
	 * Reconstructs the Graphics for this Text-field.
	 */
	public reConstruct() {

		this._textGraphicsDirty = false;

		if(this._textFormat == null)
			return;


		if (this._textGraphic) {
			this._textGraphic.dispose();
			this._textGraphic = null;

			this._textElements.clear();
			this._textElements.dispose();
			this._textElements = null;
		}

		if(this._text == "")
			return;

		var numVertices:number = 0;
		var elements:TriangleElements;
		var char_vertices:AttributesBuffer;
		var thisFormat:TesselatedFontTable=<TesselatedFontTable>this._textFormat.font_table;

		var fallbackFormat:TesselatedFontTable=null;
		if (this._textFormat.fallback_font_table)
			fallbackFormat = <TesselatedFontTable>this._textFormat.fallback_font_table;


		var char_scale:number=this._textFormat.size/thisFormat.get_font_em_size();
		var y_offset:number=0;
		var prev_char:TesselatedFontChar = null;
		var j:number = 0;
		var k:number = 0;
		var whitespace_width=(thisFormat.get_whitespace_width() * char_scale)+this._textFormat.letterSpacing;
		var textlines:Array<string> = this.text.toString().split("\\n");
		var final_lines_chars:Array<Array<TesselatedFontChar>> = [];
		var final_lines_char_scale:Array<Array<number>> = [];
		var final_lines_width:Array<number> = [];
		var final_lines_justify_bool:Array<boolean> = [];
		var final_isParagraph:Array<boolean> = [];
		var final_lines_justify:Array<number> = [];
		var maxlineWidth:number;
		for (var tl = 0; tl < textlines.length; tl++) {

			maxlineWidth=this.textWidth - (4 + this._textFormat.leftMargin + this._textFormat.rightMargin + this._textFormat.indent);
			final_lines_chars.push([]);
			final_lines_char_scale.push([]);
			final_lines_width.push(0);
			final_lines_justify.push(0);
			final_lines_justify_bool.push(false);
			final_isParagraph.push(true);


			var words:Array<string> = textlines[tl].split(" ");
			for (var i = 0; i < words.length; i++) {
				var word_width:number = 0;
				var word_chars:Array<TesselatedFontChar> = [];
				var word_chars_scale:Array<number> = [];
				var c_cnt:number = 0;
				for (var w = 0; w < words[i].length; w++) {
					char_scale = this._textFormat.size / thisFormat.get_font_em_size();
					var this_char:TesselatedFontChar = <TesselatedFontChar> thisFormat.getChar(words[i].charCodeAt(w).toString());
					if (this_char == null) {
						if (fallbackFormat) {
							char_scale = this._textFormat.size / fallbackFormat.get_font_em_size();
							this_char = fallbackFormat.getChar(words[i].charCodeAt(w).toString());
						}
					}
					if (this_char != null) {
						char_vertices = this_char.fill_data;
						if (char_vertices != null) {
							numVertices += char_vertices.count;
							// find kerning value that has been set for this char_code on previous char (if non exists, kerning_value will stay 0)
							var kerning_value:number = 0;
							if (prev_char != null) {
								for (var k:number = 0; k < prev_char.kerningCharCodes.length; k++) {
									if (prev_char.kerningCharCodes[k] == words[i].charCodeAt(w)) {
										kerning_value = prev_char.kerningValues[k];
										break;
									}
								}
							}
							word_width += ((2 + this_char.char_width + kerning_value) * char_scale) + this._textFormat.letterSpacing;
						}
						else {
							// if no char-elements was found, we insert a "space"
							word_width += whitespace_width;
						}
					}
					else {
						// if no char-elements was found, we insert a "space"
						//x_offset += thisFormat.get_font_em_size() * char_scale;
						word_width += whitespace_width;
					}
					word_chars_scale[c_cnt] = char_scale;
					word_chars[c_cnt++] = this_char;
				}

				if (((final_lines_width[final_lines_width.length - 1] + word_width) <= maxlineWidth)||(final_lines_chars[final_lines_chars.length - 1].length==0)) {
					// if line can hold this word without breaking the bounds, we can just add all chars
					for (var fw:number = 0; fw < word_chars_scale.length; fw++) {
						final_lines_chars[final_lines_chars.length - 1].push(word_chars[fw]);
						final_lines_char_scale[final_lines_char_scale.length - 1].push(word_chars_scale[fw]);
					}
					final_lines_width[final_lines_width.length - 1] += word_width;
				}
				else {
					// word does not fit
					// todo respect autowrapping properties.
					// right now we just pretend everything has autowrapping and multiline
					if(final_lines_chars[final_lines_chars.length - 1][final_lines_chars[final_lines_chars.length - 1].length-1]==null){
						final_lines_chars[final_lines_chars.length - 1].pop();
						final_lines_char_scale[final_lines_char_scale.length - 1].pop();
						final_lines_width[final_lines_width.length - 1] -= whitespace_width;
						final_lines_justify[final_lines_justify.length - 1]-=1;
					}
					final_lines_justify_bool[final_lines_justify_bool.length - 1]=true;
					final_lines_chars.push([]);
					final_lines_char_scale.push([]);
					final_lines_width.push(0);
					final_lines_justify.push(0);
					final_lines_justify_bool.push(false);
					final_isParagraph.push(false);
					for (var fw:number = 0; fw < word_chars_scale.length; fw++) {
						final_lines_chars[final_lines_chars.length - 1].push(word_chars[fw]);
						final_lines_char_scale[final_lines_char_scale.length - 1].push(word_chars_scale[fw]);
					}
					final_lines_width[final_lines_width.length - 1] = word_width;
					maxlineWidth=this.textWidth - (4 + this._textFormat.leftMargin + this._textFormat.rightMargin);
				}
				if (i < (words.length - 1)) {
					if ((final_lines_width[final_lines_width.length - 1]) <= maxlineWidth) {
						final_lines_chars[final_lines_chars.length - 1].push(null);
						final_lines_char_scale[final_lines_char_scale.length - 1].push(char_scale);
						final_lines_width[final_lines_width.length - 1] += whitespace_width;
						final_lines_justify[final_lines_justify.length - 1]+=1;
					}
				}
			}
		}

		y_offset=2+(thisFormat.ascent-thisFormat.get_font_em_size())*char_scale;

		var vertices:Float32Array = new Float32Array(numVertices*3);

		for (var i = 0; i < final_lines_chars.length; i++) {

			var intent:number=0;
			if(final_isParagraph[i]){intent=this._textFormat.indent;}
			maxlineWidth=this.textWidth - (4 + this._textFormat.leftMargin + this._textFormat.rightMargin + intent);
			var x_offset:number= 2 + this._textFormat.leftMargin + intent;
			var justify_addion:number=0;
			if(this._textFormat.align=="center"){
				x_offset=2 + this._textFormat.leftMargin + intent+(maxlineWidth-final_lines_width[i])/2;
			}
			else if(this._textFormat.align=="justify"){
				if(final_lines_justify_bool[i]){
					justify_addion=((maxlineWidth)-final_lines_width[i])/final_lines_justify[i];
				}
			}
			else if(this._textFormat.align=="right"){
				x_offset=(this._textWidth-final_lines_width[i])-(2 + this._textFormat.rightMargin);
			}
			//console.log("this._textFormat.align="+this._textFormat.align);
			//console.log("this._width="+this._width);
			for (var t = 0; t < final_lines_chars[i].length; t++) {
				var this_char:TesselatedFontChar = final_lines_chars[i][t];
				char_scale = final_lines_char_scale[i][t];
				if (this_char != null) {
					char_vertices = this_char.fill_data;
					if (char_vertices != null) {
						var buffer:Float32Array = new Float32Array(char_vertices.buffer);
						for (var v:number = 0; v < char_vertices.count; v++) {
							vertices[j++] = buffer[v*3]*char_scale + x_offset;
							vertices[j++] = buffer[v*3 + 1]*char_scale + y_offset;
							vertices[j++] = buffer[v*3 + 2];
						}
						// find kerning value that has been set for this char_code on previous char (if non exists, kerning_value will stay 0)
						var kerning_value:number = 0;
						if (prev_char != null) {
							for (var k:number = 0; k < prev_char.kerningCharCodes.length; k++) {
								if (prev_char.kerningCharCodes[k] == this._text.charCodeAt(i)) {
									kerning_value = prev_char.kerningValues[k];
									break;
								}
							}
						}
						x_offset += ((this_char.char_width + kerning_value) * char_scale) + this._textFormat.letterSpacing;

					}
					else {
						// if no char-elements was found, we insert a "space"
						x_offset+=whitespace_width+justify_addion;
					}
				}
				else{
					x_offset+=whitespace_width+justify_addion;
				}
			}
			// hack for multiline textfield in icycle.

			y_offset+=(thisFormat.ascent + thisFormat.descent)*char_scale;
			//y_offset+=(thisFormat.get_font_em_size()-thisFormat.descent)*char_scale;
			y_offset+= this._textFormat.leading;


		}



		var attributesView:AttributesView = new AttributesView(Float32Array, 3);
		attributesView.set(vertices);
		var vertexBuffer:AttributesBuffer = attributesView.attributesBuffer;
		attributesView.dispose();

		this._textElements = new TriangleElements(vertexBuffer);
		this._textElements.setPositions(new Float2Attributes(vertexBuffer));
		this._textElements.setCustomAttributes("curves", new Byte4Attributes(vertexBuffer, false));

		this._textGraphic = this._graphics.addGraphic(this._textElements);

		var sampler:Sampler2D = new Sampler2D();
		this._textGraphic.style = new Style();
		if(this._textFormat.material){
			this._textGraphic.material = this._textFormat.material;
			this._textGraphic.style.addSamplerAt(sampler, this._textGraphic.material.getTextureAt(0));
			this._textGraphic.material.animateUVs = true;
			this._textGraphic.style.uvMatrix = new Matrix(0,0,0,0, this._textFormat.uv_values[0], this._textFormat.uv_values[1]);
		}
		else{

			this._textGraphic.material = DefaultMaterialManager.getDefaultMaterial();
			this._textGraphic.material.bothSides = true;
			//this._textGraphic.material.useColorTransform = true;
			this._textGraphic.material.curves = true;
			this._textGraphic.style.addSamplerAt(sampler, this._textGraphic.material.getTextureAt(0));
			//sampler.imageRect = new Rectangle(0, 0, 0.5, 0.5);
			this._textGraphic.style.uvMatrix = new Matrix(0, 0, 0, 0, 0.126, 0);
			this._textGraphic.material.animateUVs = true;
			//graphic.material.imageRect = true;
		}
		this.material=this._textGraphic.material;
	}
	/**
	 * Appends the string specified by the <code>newText</code> parameter to the
	 * end of the text of the text field. This method is more efficient than an
	 * addition assignment(<code>+=</code>) on a <code>text</code> property
	 * (such as <code>someTextField.text += moreText</code>), particularly for a
	 * text field that contains a significant amount of content.
	 *
	 * @param newText The string to append to the existing text.
	 */
	public appendText(newText:string) {
		this._text+=newText;
	}

	/**
	 * *tells the Textfield that a paragraph is defined completly.
	 * e.g. the textfield will start a new line for future added text.
	 */
	public closeParagraph():void
	{
		//TODO
	}

	/**
	 * Returns a rectangle that is the bounding box of the character.
	 * 
	 * @param charIndex The zero-based index value for the character(for
	 *                  example, the first position is 0, the second position is
	 *                  1, and so on).
	 * @return A rectangle with <code>x</code> and <code>y</code> minimum and
	 *         maximum values defining the bounding box of the character.
	 */
	public getCharBoundaries(charIndex:number):Rectangle
	{
		return this._charBoundaries;
	}

	/**
	 * Returns the zero-based index value of the character at the point specified
	 * by the <code>x</code> and <code>y</code> parameters.
	 * 
	 * @param x The <i>x</i> coordinate of the character.
	 * @param y The <i>y</i> coordinate of the character.
	 * @return The zero-based index value of the character(for example, the
	 *         first position is 0, the second position is 1, and so on). Returns
	 *         -1 if the point is not over any character.
	 */
	public getCharIndexAtPoint(x:number, y:number):number /*int*/
	{
		return this._charIndexAtPoint;
	}

	/**
	 * Given a character index, returns the index of the first character in the
	 * same paragraph.
	 * 
	 * @param charIndex The zero-based index value of the character(for example,
	 *                  the first character is 0, the second character is 1, and
	 *                  so on).
	 * @return The zero-based index value of the first character in the same
	 *         paragraph.
	 * @throws RangeError The character index specified is out of range.
	 */
	public getFirstCharInParagraph(charIndex:number /*int*/):number /*int*/
	{
		return this._firstCharInParagraph;
	}

	/**
	 * Returns a DisplayObject reference for the given <code>id</code>, for an
	 * image or SWF file that has been added to an HTML-formatted text field by
	 * using an <code><img></code> tag. The <code><img></code> tag is in the
	 * following format:
	 *
	 * <p><pre xml:space="preserve"><code> <img src = 'filename.jpg' id =
	 * 'instanceName' ></code></pre></p>
	 * 
	 * @param id The <code>id</code> to match(in the <code>id</code> attribute
	 *           of the <code><img></code> tag).
	 * @return The display object corresponding to the image or SWF file with the
	 *         matching <code>id</code> attribute in the <code><img></code> tag
	 *         of the text field. For media loaded from an external source, this
	 *         object is a Loader object, and, once loaded, the media object is a
	 *         child of that Loader object. For media embedded in the SWF file,
	 *         it is the loaded object. If no <code><img></code> tag with the
	 *         matching <code>id</code> exists, the method returns
	 *         <code>null</code>.
	 */
	public getImageReference(id:string):DisplayObject
	{
		return this._imageReference;
	}

	/**
	 * Returns the zero-based index value of the line at the point specified by
	 * the <code>x</code> and <code>y</code> parameters.
	 * 
	 * @param x The <i>x</i> coordinate of the line.
	 * @param y The <i>y</i> coordinate of the line.
	 * @return The zero-based index value of the line(for example, the first
	 *         line is 0, the second line is 1, and so on). Returns -1 if the
	 *         point is not over any line.
	 */
	public getLineIndexAtPoint(x:number, y:number):number /*int*/
	{
		return this._lineIndexAtPoint;
	}

	/**
	 * Returns the zero-based index value of the line containing the character
	 * specified by the <code>charIndex</code> parameter.
	 * 
	 * @param charIndex The zero-based index value of the character(for example,
	 *                  the first character is 0, the second character is 1, and
	 *                  so on).
	 * @return The zero-based index value of the line.
	 * @throws RangeError The character index specified is out of range.
	 */
	public getLineIndexOfChar(charIndex:number /*int*/):number /*int*/
	{
		return this._lineIndexOfChar;
	}

	/**
	 * Returns the number of characters in a specific text line.
	 * 
	 * @param lineIndex The line number for which you want the length.
	 * @return The number of characters in the line.
	 * @throws RangeError The line number specified is out of range.
	 */
	public getLineLength(lineIndex:number /*int*/):number /*int*/
	{
		return this._lineLength;
	}

	/**
	 * Returns metrics information about a given text line.
	 * 
	 * @param lineIndex The line number for which you want metrics information.
	 * @return A TextLineMetrics object.
	 * @throws RangeError The line number specified is out of range.
	 */
	public getLineMetrics(lineIndex:number /*int*/):TextLineMetrics
	{
		return this._lineMetrics;
	}

	/**
	 * Returns the character index of the first character in the line that the
	 * <code>lineIndex</code> parameter specifies.
	 * 
	 * @param lineIndex The zero-based index value of the line(for example, the
	 *                  first line is 0, the second line is 1, and so on).
	 * @return The zero-based index value of the first character in the line.
	 * @throws RangeError The line number specified is out of range.
	 */
	public getLineOffset(lineIndex:number /*int*/):number /*int*/
	{
		return this._lineOffset;
	}

	/**
	 * Returns the text of the line specified by the <code>lineIndex</code>
	 * parameter.
	 * 
	 * @param lineIndex The zero-based index value of the line(for example, the
	 *                  first line is 0, the second line is 1, and so on).
	 * @return The text string contained in the specified line.
	 * @throws RangeError The line number specified is out of range.
	 */
	public getLineText(lineIndex:number /*int*/):string
	{
		return this._lineText;
	}

	/**
	 * Given a character index, returns the length of the paragraph containing
	 * the given character. The length is relative to the first character in the
	 * paragraph(as returned by <code>getFirstCharInParagraph()</code>), not to
	 * the character index passed in.
	 * 
	 * @param charIndex The zero-based index value of the character(for example,
	 *                  the first character is 0, the second character is 1, and
	 *                  so on).
	 * @return Returns the number of characters in the paragraph.
	 * @throws RangeError The character index specified is out of range.
	 */
	public getParagraphLength(charIndex:number /*int*/):number /*int*/
	{
		return this._paragraphLength;
	}

	/**
	 * Returns a TextFormat object that contains formatting information for the
	 * range of text that the <code>beginIndex</code> and <code>endIndex</code>
	 * parameters specify. Only properties that are common to the entire text
	 * specified are set in the resulting TextFormat object. Any property that is
	 * <i>mixed</i>, meaning that it has different values at different points in
	 * the text, has a value of <code>null</code>.
	 *
	 * <p>If you do not specify values for these parameters, this method is
	 * applied to all the text in the text field. </p>
	 *
	 * <p>The following table describes three possible usages:</p>
	 * 
	 * @return The TextFormat object that represents the formatting properties
	 *         for the specified text.
	 * @throws RangeError The <code>beginIndex</code> or <code>endIndex</code>
	 *                    specified is out of range.
	 */
	public getTextFormat(beginIndex:number /*int*/ = -1, endIndex:number /*int*/ = -1):TextFormat
	{
		return this._textFormat;
	}

	/**
	 * Replaces the current selection with the contents of the <code>value</code>
	 * parameter. The text is inserted at the position of the current selection,
	 * using the current default character format and default paragraph format.
	 * The text is not treated as HTML.
	 *
	 * <p>You can use the <code>replaceSelectedText()</code> method to insert and
	 * delete text without disrupting the character and paragraph formatting of
	 * the rest of the text.</p>
	 *
	 * <p><b>Note:</b> This method does not work if a style sheet is applied to
	 * the text field.</p>
	 * 
	 * @param value The string to replace the currently selected text.
	 * @throws Error This method cannot be used on a text field with a style
	 *               sheet.
	 */
	public replaceSelectedText(value:string):void
	{

	}

	/**
	 * Replaces the range of characters that the <code>beginIndex</code> and
	 * <code>endIndex</code> parameters specify with the contents of the
	 * <code>newText</code> parameter. As designed, the text from
	 * <code>beginIndex</code> to <code>endIndex-1</code> is replaced.
	 *
	 * <p><b>Note:</b> This method does not work if a style sheet is applied to
	 * the text field.</p>
	 * 
	 * @param beginIndex The zero-based index value for the start position of the
	 *                   replacement range.
	 * @param endIndex   The zero-based index position of the first character
	 *                   after the desired text span.
	 * @param newText    The text to use to replace the specified range of
	 *                   characters.
	 * @throws Error This method cannot be used on a text field with a style
	 *               sheet.
	 */
	public replaceText(beginIndex:number /*int*/, endIndex:number /*int*/, newText:string):void
	{

	}

	/**
	 * Sets as selected the text designated by the index values of the first and
	 * last characters, which are specified with the <code>beginIndex</code> and
	 * <code>endIndex</code> parameters. If the two parameter values are the
	 * same, this method sets the insertion point, as if you set the
	 * <code>caretIndex</code> property.
	 * 
	 * @param beginIndex The zero-based index value of the first character in the
	 *                   selection(for example, the first character is 0, the
	 *                   second character is 1, and so on).
	 * @param endIndex   The zero-based index value of the last character in the
	 *                   selection.
	 */
	public setSelection(beginIndex:number /*int*/, endIndex:number /*int*/):void
	{

	}

	/**
	 * Applies the text formatting that the <code>format</code> parameter
	 * specifies to the specified text in a text field. The value of
	 * <code>format</code> must be a TextFormat object that specifies the desired
	 * text formatting changes. Only the non-null properties of
	 * <code>format</code> are applied to the text field. Any property of
	 * <code>format</code> that is set to <code>null</code> is not applied. By
	 * default, all of the properties of a newly created TextFormat object are
	 * set to <code>null</code>.
	 *
	 * <p><b>Note:</b> This method does not work if a style sheet is applied to
	 * the text field.</p>
	 *
	 * <p>The <code>setTextFormat()</code> method changes the text formatting
	 * applied to a range of characters or to the entire body of text in a text
	 * field. To apply the properties of format to all text in the text field, do
	 * not specify values for <code>beginIndex</code> and <code>endIndex</code>.
	 * To apply the properties of the format to a range of text, specify values
	 * for the <code>beginIndex</code> and the <code>endIndex</code> parameters.
	 * You can use the <code>length</code> property to determine the index
	 * values.</p>
	 *
	 * <p>The two types of formatting information in a TextFormat object are
	 * character level formatting and paragraph level formatting. Each character
	 * in a text field can have its own character formatting settings, such as
	 * font name, font size, bold, and italic.</p>
	 *
	 * <p>For paragraphs, the first character of the paragraph is examined for
	 * the paragraph formatting settings for the entire paragraph. Examples of
	 * paragraph formatting settings are left margin, right margin, and
	 * indentation.</p>
	 *
	 * <p>Any text inserted manually by the user, or replaced by the
	 * <code>replaceSelectedText()</code> method, receives the default text field
	 * formatting for new text, and not the formatting specified for the text
	 * insertion point. To set the default formatting for new text, use
	 * <code>defaultTextFormat</code>.</p>
	 * 
	 * @param format A TextFormat object that contains character and paragraph
	 *               formatting information.
	 * @throws Error      This method cannot be used on a text field with a style
	 *                    sheet.
	 * @throws RangeError The <code>beginIndex</code> or <code>endIndex</code>
	 *                    specified is out of range.
	 */
	public setTextFormat(format:TextFormat, beginIndex:number /*int*/ = -1, endIndex:number /*int*/ = -1):void
	{

	}

	/**
	 * Returns true if an embedded font is available with the specified
	 * <code>fontName</code> and <code>fontStyle</code> where
	 * <code>Font.fontType</code> is <code>flash.text.FontType.EMBEDDED</code>.
	 * Starting with Flash Player 10, two kinds of embedded fonts can appear in a
	 * SWF file. Normal embedded fonts are only used with TextField objects. CFF
	 * embedded fonts are only used with the flash.text.engine classes. The two
	 * types are distinguished by the <code>fontType</code> property of the
	 * <code>Font</code> class, as returned by the <code>enumerateFonts()</code>
	 * function.
	 *
	 * <p>TextField cannot use a font of type <code>EMBEDDED_CFF</code>. If
	 * <code>embedFonts</code> is set to <code>true</code> and the only font
	 * available at run time with the specified name and style is of type
	 * <code>EMBEDDED_CFF</code>, Flash Player fails to render the text, as if no
	 * embedded font were available with the specified name and style.</p>
	 *
	 * <p>If both <code>EMBEDDED</code> and <code>EMBEDDED_CFF</code> fonts are
	 * available with the same name and style, the <code>EMBEDDED</code> font is
	 * selected and text renders with the <code>EMBEDDED</code> font.</p>
	 * 
	 * @param fontName  The name of the embedded font to check.
	 * @param fontStyle Specifies the font style to check. Use
	 *                  <code>flash.text.FontStyle</code>
	 * @return <code>true</code> if a compatible embedded font is available,
	 *         otherwise <code>false</code>.
	 * @throws ArgumentError The <code>fontStyle</code> specified is not a member
	 *                       of <code>flash.text.FontStyle</code>.
	 */
	public static isFontCompatible(fontName:string, fontStyle:string):boolean
	{
		return false;
	}

    public clone():TextField
    {
		var newInstance:TextField = (TextField._textFields.length)? TextField._textFields.pop() : new TextField();

		this.copyTo(newInstance);

		return newInstance;
    }


	public copyTo(newInstance:TextField):void
	{
		super.copyTo(newInstance);

		newInstance.textWidth = this._textWidth;
		newInstance.textHeight = this._textHeight;
		newInstance.textFormat = this._textFormat;
		//newInstance.textColor = this._textColor;
		newInstance.text = this._text;
	}
}