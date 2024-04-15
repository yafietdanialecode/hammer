/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MouseEvent,
  WheelEvent,
  useEffect,
  useState,
} from "react";
import "./config.css";
import "./App.css";
import Elem from "./lib/modules/Elem";
import Unit from "./lib/modules/unit";
import Scroll from "./lib/modules/scroll";
import Style from "./lib/modules/Style";
import { getCIArea } from "./lib/modules/getCIArea";
import Logic from "./lib/modules/Logic";
import Component from "./lib/modules/Component";
import { SpeedInsights } from "@vercel/speed-insights/react"
import {
  BOTTOM_RESIZE,
  CANVAS,
  DECORATORS,
  LEFT_RESIZE,
  LEFT_TOOLS,
  LOGO,
  MAIN,
  MULTIPLE_ELEMENTS_WRAPPER,
  PAGES_DATATYPE,
  PROJECT_TITLE,
  REFERENCE,
  RIGHT_RESIZE,
  SCALE_REFERENCE,
  STATES,
  TOP_RESIZE,
  UPPER_TOOLS,
} from "./lib/id-storage/constants.config";
import screenVisibleElements from "./lib/scope/screenVisibleElements";
// import State from "./lib/modules/State";
import focusOn from "./lib/modules/Focus";
import UnitClassTest from "./test/UnitClass.test";
import { componentsData } from "./lib/components-data";
import ED from "./lib/element-delete";
import InputSection from "./ui/input-section";
import { Add, AlignHorizontalCenter, AlignHorizontalLeft, AlignHorizontalRight, AlignVerticalBottom, AlignVerticalCenter, AlignVerticalTop, Apps, Remove, Visibility } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";




function App() {
  
  const [mode, set_mode] = useState('move');
  const [scale, set_scale] = useState(1); // this is the nx the user zoom the screen [ warning this will be good if you don't resize the actual screen ]
   
  // indicates how much user scrolled
  const [scrollTop, set_scrollTop] = useState(0);
  const [scrollLeft, set_scrollLeft] = useState(0);


  // selection event verification 1
  const [selectionStarted, set_selectionStarted] = useState(false);
  // this is second confirmation for mouse selectionstarted
  const [selectionStarted2, set_selectionStarted2] = useState(false);
  // selectionType = text / elements
  const [selectionType, set_selectionType] = useState("");
  // starting horizontal and vertical position
  const [startSelectingFrom, set_startSelectingFrom] = useState({ x: 0, y: 0 });
  // tracks where the selection stopped
  const [includeSelectingUpto, set_includeSelectingUpto] = useState({
    x: 0,
    y: 0,
  });
  // lists of selected elements in this coordinate
  const [selectedElements, set_selectedElements] = useState([]);
  // where the selected component comes
  const [fromWhereAreTheComponent, set_fromWhereAreTheComponent] =
    useState(CANVAS);

  // show all selected elements wrapper
  const [
    multiSelectedElementsWrapperDivStartFrom,
    set_multiSelectedElementsWrapperDivStartFrom,
  ] = useState({ x: 0, y: 0 });
  const [
    multiSelectedElementsWrapperDivInclude,
    set_multiSelectedElementsWrapperDivInclude,
  ] = useState({ x: 0, y: 0 });

  // seleElement
  const [seleElement, set_seleElement] = useState(CANVAS);

  // element configs
  const [element_config, set_element_config] = useState({
    data_type: '', // page | heading | specific component | other
    id: '', // unique id of the component
    isPage: false,
    isCanvas: true,
    visible: true,
    contentEditable: false
  })

  const [element_style, set_element_style] = useState({
    color: '',
    background: ''
  })

  const [loading, set_loading] = useState(true);

  // cursor based
  const [cursorStyle, set_cursorStyle] = useState("grab");

  // movement
  const [startMovingObject, set_startMovingObject] = useState(false);
  const [objectCursorDifference, set_objectCursorDifference] = useState({
    x: 0,
    y: 0,
  });
  const [movingFrom, set_movingFrom] = useState(CANVAS);
  const [movingTo, set_movingTo] = useState(CANVAS);

  // editing features
  const [textEditingModeEnabled, set_textEditingModeEnabled] = useState(false);

  // context options
  const [displayContext, set_displayContext] = useState(false);
  const [contextMenuPosition, set_contextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  // mouse states
  const [mousePosition, set_mousePosition] = useState({ x: 0, y: 0 });

  // dev states [ those states are only for dev environment ]
  const [displayDevStates, set_displayDevStates] = useState(false);

  /**
   * those are states of resizing a component
   * the states below are for tools under decorators
   */

  const [startResizing, set_startResizing] = useState(false); // start and end of resizing
  const [whatToResize, set_whatToResize] = useState(""); // the type of resizing
  const [elementLeftPosition, set_elementLeftPosition] = useState({
    x: 0,
    y: 0,
  });
  const [elementRightPosition, set_elementRightPosition] = useState({
    x: 0,
    y: 0,
  });
  const [elementTopPosition, set_elementTopPosition] = useState({ x: 0, y: 0 });
  const [elementBottomPosition, set_elementBottomPosition] = useState({
    x: 0,
    y: 0,
  });

  // referencing states and alignment
  const [visibleComponents, set_visibleComponents]: any = useState([]);

  // adding new element state
  const [addNewElement, set_addNewElement] = useState(false);
  const [newElement, set_newElement] = useState('');

  // moving the screen by moving feature
  const [startMovingFeature, set_startMovingFeature] = useState(false);
  
  // right-menu states
  const [displayRightMenu, set_displayRightMenu] = useState(false);
  const [title, set_title] = useState('');
  const [page_id, set_page_id] = useState('');
  const [endpoint, set_endpoint] = useState('');
  const [description, set_description] = useState('');
  const [tags, set_tags] = useState(['']);
  const [links, set_links] = useState([ { id: '', name: '', type: '', uri: '' } ])
  const [scripts, set_scripts] = useState([ { id: '', name: '', type: '', uri: '' } ] );

  // clipboard
  const [clipboard, set_clipboard] = useState({
    node: null,
    text: null,
    url: null,
    origin: CANVAS
  })

  // key state trackers previous
  const [previous_key, set_previous_key] = useState('');

  
  /**
   * this is the hook that will start when
   * the page loaded and rendered
   * [ only once it opened ]
   */
  useEffect(() => {
    console.log("page initiated");
    Elem.id(CANVAS)!.scrollTo({
      behavior: "instant",
      top: 10000,
      left: 10000,
    });

    set_tags([ 'amazing', 'good' ]);
    set_links([
      { id: '0', name: 'bootstrap icons', type: 'stylesheet', uri: 'http://hellobootstrap.com/fkjdfklsjfdjs'}
    ])
    set_page_id('PAGE-090583458049850934850984309-USESR')
    set_scripts([
      { id: '1', name: 'jquery', type: 'javascript', uri: 'http://jqueryonthego.com/download'}
    ])

  }, []);

  /**
   * this is the hook that will execute every time
   * react updates the ui
   * [ infinite loop might occur so be careful ]
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // updating user's scroll amount
    set_scrollTop(Scroll.top(CANVAS)!);
    set_scrollLeft(Scroll.left(CANVAS)!);

    console.clear();
    console.log('ref_width: ' + (Style.width(SCALE_REFERENCE)));
    console.clear();
    console.log('window_width: ' + (window.innerWidth));
    console.log('actual_width: ' + screen.width);
    console.log('scale: ' + (screen.width / window.innerWidth))
    set_scale((screen.width / window.innerWidth));
  });


  window.addEventListener('load', () => {
    set_loading(false);
  })

  // when mouse move in the whole window
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.addEventListener("mousemove", (e: any) => {


    // graphics functionality in the ui
    // if(Logic.)

    // update mouse position every time
    set_mousePosition({ x: e.clientX, y: e.clientY });

    /**
     * when user selects in component mode
     * this decides how inclusive the selected range or zone will be
     */
    if (selectionStarted && !startMovingObject && mode == 'select') {
      set_selectionStarted2(true);
      set_includeSelectingUpto({
        x: e.clientX + scrollLeft,
        y: e.clientY + scrollTop,
      });
      Elem.id(seleElement)!.style.outline = 'none';
    }
  });

  window.onmouseup = () => {

    // outline cleaner
    if(Elem.id(seleElement)!.parentElement!.id !== CANVAS){
      Elem.id(seleElement)!.style.outline = 'none';
    }

    // if user was moving the canvas
    if(mode === 'move'){
      // moving the canvas feature
      set_startMovingFeature(false);
    }
    
    // some ui changing
    if(cursorStyle == 'grabbing'){
      set_cursorStyle('grab')
    }

    // if user have been resizing component
    if (startResizing) {
      /**
       * after user mouse release there will be no resizing
       */

      set_startResizing(false);
      set_whatToResize("");
      focusOn(seleElement);
    }

    // /**
    //  * the code inside the next if statement is a feature for migrating
    //  * a child of page to CANVAS or to page and a child of CANVAS to page
    //  */
    // // when user releases the mouse
    // if (movingFrom !== movingTo && startMovingObject) {
    //   // moving single component features below
      
    //   const parent = Elem.id(seleElement)!.parentElement!.id;
    //   Elem.id(seleElement)!.style.outline = "0.1vw solid rgb(107, 154, 255)";

    //   if (
    //     seleElement &&
    //     selectedElements.length < 2 &&
    //     seleElement !== MULTIPLE_ELEMENTS_WRAPPER
    //   ) {
    //     /* moving single component from CANVAS > page
    //      */
    //     if (
    //       movingFrom == CANVAS &&
    //       movingTo != CANVAS &&
    //       Elem.id(seleElement)!.getAttribute("data-type") !== "page"
    //       && seleElement !== MULTIPLE_ELEMENTS_WRAPPER
    //     ) {
    //       Elem.id(seleElement)!.style.outline = 'none';
    //       const clone: any = Elem.id(seleElement)!.cloneNode(true);
    //       clone.style.top = Unit.px(
    //         Style.top(seleElement) - Style.top(movingTo)
    //       );
    //       clone.style.left = Unit.px(
    //         Style.left(seleElement) - Style.left(movingTo)
    //       );
    //       Elem.id(seleElement)?.remove();
    //       Elem.id(movingTo)?.append(clone);
    //     }
    //     // moving single component from page > canvas
    //     if (
    //       movingFrom !== CANVAS &&
    //       movingTo == CANVAS &&
    //       Elem.id(seleElement)!.getAttribute("data-type") !== "page"
    //       && seleElement !== MULTIPLE_ELEMENTS_WRAPPER
    //     ) {
    //       const clone: any = Elem.id(seleElement)!.cloneNode(true);

    //       clone.style.top = Unit.px(
    //         mousePosition.y +
    //           scrollTop -
    //           (objectCursorDifference.y - Style.top(parent)) +
    //           scrollTop
    //       );
    //       clone.style.left = Unit.px(
    //         mousePosition.x +
    //           scrollLeft -
    //           (objectCursorDifference.x - Style.left(parent)) +
    //           scrollLeft
    //       );
    //       Elem.id(seleElement)?.remove();
    //       Elem.id(CANVAS)?.append(clone);
    //     }
    //     // moving single component from page > page
    //     if (
    //       movingFrom !== CANVAS &&
    //       movingTo !== CANVAS &&
    //       Elem.id(seleElement)!.getAttribute("data-type") !== "page" &&
    //       Elem.id(movingFrom)!.getAttribute("data-type") == "page" &&
    //       Elem.id(movingTo)!.getAttribute("data-type") == "page" &&
    //       seleElement !== MULTIPLE_ELEMENTS_WRAPPER
    //     ) {
    //       const clone: any = Elem.id(seleElement)!.cloneNode(true);

    //       clone.style.top = Unit.px(
    //         e.clientY -
    //           (objectCursorDifference.y -
    //             Style.top(Elem.id(seleElement)!.parentElement!.id)) -
    //           Style.top(movingTo) +
    //           scrollTop
    //       );
    //       clone.style.left = Unit.px(
    //         e.clientX -
    //           (objectCursorDifference.x -
    //             Style.left(Elem.id(seleElement)!.parentElement!.id)) -
    //           Style.left(movingTo) +
    //           scrollLeft
    //       );

    //       Elem.id(seleElement)?.remove();
    //       Elem.id(movingTo)?.append(clone);
    //     }
    //   }


    //   if (
    //     selectedElements.length > 1 &&
    //     seleElement === MULTIPLE_ELEMENTS_WRAPPER
    //   ) {
    //     /* moving single component from CANVAS > page
    //      */
    //     /**
    //  * after user selects some component
    //  * we will clone them and do some edits
    //  * and append them to the wrapper (moving object wrapper)
    //  * this helps us to don't update position of each selected
    //  * element when we need to move them
    //  */
    // if (selectedElements.length > 1 && Elem.id(movingTo)!.getAttribute('data-type') == PAGES_DATATYPE) {

    //   selectedElements.map((each: string) => {
    //     /**
    //      * we clone them b/c they will be removed from the previous position temporarily
    //      */
    //     const copy: any = Elem.id(each)!.cloneNode(true);
    //     /**
    //      * top and left position of the wrapper and CANVAS is different
    //      * that's why we update the elements position and append the new
    //      * one to the wrapper
    //      */
    //     copy.style.top = Unit.px((Style.top(each) - Style.top(movingTo)));
    //     copy.style.left = Unit.px(Style.left(each) - Style.left(movingTo));
    //     Elem.id(each)?.remove();
    //     Elem.id(movingTo)!.append(copy);
    //   });
    //   set_selectedElements([]);
    //   set_seleElement(movingTo);
    // }
        
    //   }

      
    // }

    /**
     * when user release there mouse
     * we need to stop events like:
     *      - moving object
     *      - selection verifications (both)
     */
    set_startMovingObject(false);
    set_selectionStarted(false);
    set_selectionStarted2(false);

    /**
     * after user selects some component
     * we will clone them and do some edits
     * and append them to the wrapper (moving object wrapper)
     * this helps us to don't update position of each selected
     * element when we need to move them
     */
    if (selectedElements.length > 1 && !startMovingObject && movingTo == CANVAS) {
      // wrapper
      const wrapper = Elem.id(MULTIPLE_ELEMENTS_WRAPPER)!;
      /**
       * for each selected elements we will edit and append them to wrapper
       */
      selectedElements.map((each: string) => {
        /**
         * we clone them b/c they will be removed from the previous position temporarily
         */
        const copy: any = Elem.id(each)!.cloneNode(true);

        /**
         * top and left position of the wrapper and CANVAS is different
         * that's why we update the elements position and append the new
         * one to the wrapper
         */
        copy.style.top = Unit.px(
          Style.top(each) -
            multiSelectedElementsWrapperDivStartFrom.y +
            scrollTop
        );
        copy.style.left = Unit.px(
          Style.left(each) -
            multiSelectedElementsWrapperDivStartFrom.x +
            scrollLeft
        );
        Elem.id(each)?.remove();
        wrapper.append(copy);
      });
    }

  };

  /**
   * browsers default context menu options are not permitted
   * because we need more custom workflows and if we don't prevent
   * them they might crush the application in some cases
   */
  window.oncontextmenu = (e: any) => {
    e.preventDefault();
    set_displayContext(true);
    set_contextMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };


  /**
   * key events are now added to windows to make user job simplified
   */

  window.onkeydown = (e: any) => {
    /**
     * WARNING:
     * remember if every thing is stable
     * make those functionalities dependent on not user's text editing event
     * is enabled
     * [ simply : if user's editText state enabled those should not work]
     */

    // all key events actions related to CANVAS element are hear

    // those features work or not work based on users state
    if (!textEditingModeEnabled) {
      /**
       * those are keys will not work as default if users are not editing text
       */
      const DIRECTION_KEYS = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ];
      if (DIRECTION_KEYS.some((key: string) => key == e.key)) {
        e.preventDefault();
        const top_e = parseInt(Elem.id(seleElement)!.style.top);
        const left_e = parseInt(Elem.id(seleElement)!.style.left);
        let amount = 1;
        if(e.ctrlKey){
          amount = 3;
        }
        switch (e.key) {
          case "ArrowUp":
            Elem.id(seleElement)!.style.top = Unit.px(top_e - amount);
            break;
          case "ArrowDown":
            Elem.id(seleElement)!.style.top = Unit.px(top_e + amount);
            break;
          case "ArrowLeft":
            Elem.id(seleElement)!.style.left = Unit.px(left_e - amount);
            break;
          case "ArrowRight":
            Elem.id(seleElement)!.style.left = Unit.px(left_e + amount);
            break;
        }
      }
      /**
       * those are keys which work if user is not editing text
       */

      /**
       * to delete element by pressing del key in laptop
       */
      if (e.key == "Delete") {
        ED.rm(seleElement, CANVAS, set_seleElement);
        // delete multiple
        if(selectedElements.length > 1){
          ED.rmm(selectedElements, CANVAS, set_seleElement, set_selectedElements);
        }
      }

      /**
       * to copy an element
       */
      if(e.key == 'c' && e.ctrlKey && logic.notInExceptions(seleElement, [ CANVAS, MULTIPLE_ELEMENTS_WRAPPER ])){
        const new_clipboard: any = {
          node: Elem.id(seleElement)!.cloneNode(true),
          text: clipboard.text,
          url: clipboard.url,
          origin: Elem.id(seleElement)!.parentElement!.id
        }
        set_clipboard(new_clipboard);
        console.log('copied', Elem.id(seleElement)!.cloneNode(true));
        // if child elements have id
        let counter = 1;
        Elem.id(seleElement)!.querySelectorAll('*').forEach((each: any) => {
          if(each.id.length > 0){
            each.id = Date.now() + counter;
          }
          counter++;
        })
      }

      /**
       * to paste an element
       */
      if(e.key == 'v' && e.ctrlKey){
        console.log('paste');
        
        if(clipboard.origin == CANVAS){
          const new_id = 'ID' + Date.now();
          const element: any = clipboard.node;
          element.id = new_id;
          Elem.id(clipboard.origin)!.append(element);
          Elem.id(seleElement)!.style.outline = 'none';
          focusOn(new_id);
          set_seleElement(new_id);
        }else if(Elem.id(clipboard.origin)!.getAttribute('data-type') === PAGES_DATATYPE){
          const new_id = 'ID' + Date.now();
          const element: any = clipboard.node;
          element.id = new_id;
          Elem.id(clipboard.origin)!.append(element);
          Elem.id(seleElement)!.style.outline = 'none';
          focusOn(new_id);
          set_seleElement(new_id);
        }
      }

      // this is for preventing unexpected scroll by space bar
      if(e.key == ' '){
        e.preventDefault();
      }
      /**
       * select multiple feature by pressing ctr + a/A is here */
      //  this feature is not supported currently we will add it soon
      // if(e.key == 'a' && e.ctrlKey){

      //   logic.selectAll(
      //     logic.CANVA_ELEMENT_EXCEPTION,
      //     set_selectedElements
      //     )
      // }
      /**
       * move the element forward
       */
      else if (e.key == "]") {
        Elem.id(seleElement)!.style.zIndex = `${
          Style.zIndex(seleElement) + 1
        }`;
      }
      /**
       * move the element backward
       */
      if (e.key == "[") {
        Elem.id(seleElement)!.style.zIndex = `${
          Style.zIndex(seleElement) - 1
        }`;
      }
      // mode switch
      switch(e.key){
        case 't':
            set_mode('text');
            set_cursorStyle('text');
          set_seleElement('');
        break;
        case 'v':
          set_mode('select');
          set_cursorStyle('default')
          break;
        case 'm':
          set_mode('move');
          set_cursorStyle('grab');
          set_seleElement('');
          set_seleElement(CANVAS);
          break;
        case 'i':
          set_mode('image');
          set_cursorStyle('crosshair');
          break;
        case '/':
          set_addNewElement(true);
          set_textEditingModeEnabled(true); // tells the program we are typing
          set_newElement(''); // to remove the previous element
          set_seleElement(''); // this takes the focus in selected component out of it
          setTimeout(() => {
            Elem.id('search-components')!.focus({ preventScroll: true });
          }, 100)          
          break;
      }
    }

    // if user is editing text
    if(textEditingModeEnabled){
      if(e.key == 'Enter'){
        // e.preventDefault();
      }
    }

    // save the key as last key
    set_previous_key(e.key);
  }

  // this is the logic class
  const logic = new Logic("root", { CANVAS_ID: CANVAS });
  
  return (
    <>
      <div
        id={MAIN}
        tabIndex={-1}
        onMouseMove={(e: MouseEvent) => {


          if(mode === 'move' && startMovingFeature){
            // let s = scale / 5;
            // scale < 1 ? s = scale : null;
            const scale_fix = (5 - scale) / 5;
            Elem.id(CANVAS)!.scrollBy({ left: 0 - (e.movementX * scale_fix), top: 0 - (e.movementY * scale_fix), behavior: 'instant' })
          }

          /**
           * resizing features
           */

          if (startResizing) {
            /**
             * this is the action taker for each type ( specifically 8 types of resizes )
             * this takes:
             *  1. whether resize starts
             *  2. which type of resize is occurring
             *  3. which point
             */

            // top resize
            if (whatToResize == "top") {
              // if this is an element inside a CANVAS
              if (Elem.id(seleElement)!.parentElement!.id == CANVAS) {
                Elem.id(seleElement)!.style.top = Unit.px(
                  e.clientY + scrollTop
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  elementBottomPosition.y - (e.clientY + scrollTop)
                );
              }
              // if this is an element inside a page
              else if (
                Elem.id(seleElement)!.parentElement!.getAttribute(
                  "data-type"
                ) == "page"
              ) {
                const parent = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.top = Unit.px(
                  e.clientY - Style.top(parent)
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  (elementBottomPosition.y -
                    Style.top(parent) -
                    (e.clientY - Style.top(parent))) - scrollTop
                );
              }
            } else if (whatToResize == "right") {
              // if this is an element inside a CANVAS
              if (Elem.id(seleElement)!.parentElement!.id == CANVAS) {
                Elem.id(seleElement)!.style.left = Unit.px(
                  elementLeftPosition.x
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  (e.clientX + scrollLeft) - elementLeftPosition.x
                );
              }
              // if this is an element inside a page
              else if (
                Elem.id(seleElement)!.parentElement!.getAttribute(
                  "data-type"
                ) == "page"
              ) {
                const parent = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.left = Unit.px(
                  elementLeftPosition.x - (Style.left(parent) + scrollLeft)
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  (e.clientX + scrollLeft) - elementLeftPosition.x
                );
              }
            } else if (whatToResize == "bottom") {
              // if this is an element inside a CANVAS
              if (Elem.id(seleElement)!.parentElement!.id == CANVAS) {
                Elem.id(seleElement)!.style.top = Unit.px(
                  elementTopPosition.y
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                 (e.clientY + scrollTop) - elementTopPosition.y
                );
              }
              // if this is an element inside a page
              else if (
                Elem.id(seleElement)!.parentElement!.getAttribute(
                  "data-type"
                ) == "page"
              ) {
                const parent = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.top = Unit.px(
                  elementTopPosition.y - (Style.top(parent) + scrollTop)
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  (e.clientY + scrollTop) - elementTopPosition.y
                );
              }
            } else if (whatToResize == "left") {
              // if this is an element inside a CANVAS
              if (Elem.id(seleElement)!.parentElement!.id == CANVAS) {
                Elem.id(seleElement)!.style.left = Unit.px(
                  e.clientX + scrollLeft
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  elementRightPosition.x - (e.clientX + scrollLeft)
                );
              }
              // if this is an element inside a page
              else if (
                Elem.id(seleElement)!.parentElement!.getAttribute(
                  "data-type"
                ) == "page"
              ) {
                const parent = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.left = Unit.px(
                  e.clientX - Style.left(parent)
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  elementRightPosition.x - (e.clientX + scrollLeft)
                );
              }
            }
            // top left resize
            else if (whatToResize == "top-left") {
              // if this is an element inside a CANVAS
              if (Elem.id(seleElement)!.parentElement!.id == CANVAS) {
                Elem.id(seleElement)!.style.top = Unit.px(
                  e.clientY + scrollTop
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  elementBottomPosition.y - (e.clientY + scrollTop)
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  e.clientX + scrollLeft
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  elementBottomPosition.x - (e.clientX + scrollLeft)
                );
              }
              // if this is an element inside a page
              else if (
                Elem.id(seleElement)!.parentElement!.getAttribute(
                  "data-type"
                ) == "page"
              ) {
                const parent = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.top = Unit.px(
                  e.clientY - Style.top(parent)
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  (elementBottomPosition.y -
                    Style.top(parent) -
                    (e.clientY - Style.top(parent))) - scrollTop
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  e.clientX - Style.left(parent)
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  elementBottomPosition.x - (e.clientX + scrollLeft)
                );
              }
            }// top right resize
            else if (whatToResize == "top-right") {
              // if this is an element inside a CANVAS
              if (Elem.id(seleElement)!.parentElement!.id == CANVAS) {
                Elem.id(seleElement)!.style.top = Unit.px(
                  e.clientY + scrollTop
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  elementBottomPosition.y - (e.clientY + scrollTop)
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  elementBottomPosition.x
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  (e.clientX + scrollLeft) - elementBottomPosition.x
                );
              }
              // if this is an element inside a page
              else if (
                Elem.id(seleElement)!.parentElement!.getAttribute(
                  "data-type"
                ) == "page"
              ) {
                const parent = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.top = Unit.px(
                  e.clientY - Style.top(parent)
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  (elementBottomPosition.y -
                    Style.top(parent) -
                    (e.clientY - Style.top(parent))) - scrollTop
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  elementBottomPosition.x - (Style.left(parent) + scrollLeft)
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                 (scrollLeft + e.clientX) - elementBottomPosition.x
                );
              }
            }// bottom right resize
            else if (whatToResize == "bottom-right") {
              // if this is an element inside a CANVAS
              if (Elem.id(seleElement)!.parentElement!.id == CANVAS) {
                Elem.id(seleElement)!.style.top = Unit.px(
                  elementTopPosition.y
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  (e.clientY + scrollTop) - elementTopPosition.y
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  elementTopPosition.x
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  (e.clientX + scrollLeft) - elementTopPosition.x
                );
              }
              // if this is an element inside a page
              else if (
                Elem.id(seleElement)!.parentElement!.getAttribute(
                  "data-type"
                ) == "page"
              ) {
                const parent = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.top = Unit.px(
                  elementTopPosition.y - (Style.top(parent) + scrollTop)
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                    (e.clientY + scrollTop) - elementTopPosition.y
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  elementTopPosition.x - (Style.left(parent) + scrollLeft)
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                 (e.clientX + scrollLeft) - elementTopPosition.x
                );
              }
            }// bottom right resize
            else if (whatToResize == "bottom-left") {
              // if this is an element inside a CANVAS
              if (Elem.id(seleElement)!.parentElement!.id == CANVAS) {
                Elem.id(seleElement)!.style.top = Unit.px(
                  elementTopPosition.y
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                  (e.clientY + scrollTop) - elementTopPosition.y
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  e.clientX + scrollLeft
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                  elementTopPosition.x - (e.clientX + scrollLeft)
                );
              }
              // if this is an element inside a page
              else if (
                Elem.id(seleElement)!.parentElement!.getAttribute(
                  "data-type"
                ) == "page"
              ) {
                const parent = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.top = Unit.px(
                  elementTopPosition.y - (Style.top(parent) + scrollTop)
                );
                Elem.id(seleElement)!.style.height = Unit.px(
                    (e.clientY + scrollTop) - elementTopPosition.y
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  e.clientX - Style.left(parent)
                );
                Elem.id(seleElement)!.style.width = Unit.px(
                 (elementTopPosition.x - (e.clientX + scrollLeft))
                );
              }
            }
          }

          /**
           * this is the code who set's selected component position
           * both top and left
           */
          if (startMovingObject) {
            if (Elem.id(seleElement)!.parentElement!.id === CANVAS) {
              Elem.id(seleElement)!.style.top = Unit.px(
                e.clientY + scrollTop - objectCursorDifference.y
              );
              Elem.id(seleElement)!.style.left = Unit.px(
                e.clientX + scrollLeft - objectCursorDifference.x
              );
            } else if (
              // if we are moving an element inside a page
              Elem.id(seleElement)!.parentElement?.getAttribute("data-type") ===
              "page"
            ) {
              Elem.id(seleElement)!.style.top = Unit.px(
                e.clientY - scrollTop - objectCursorDifference.y
              );
              Elem.id(seleElement)!.style.left = Unit.px(
                e.clientX - scrollLeft - objectCursorDifference.x
              );
            }
            // this is where elements get appended inside and page and get out from page
            if (seleElement.length > 0 || selectedElements.length > 1) {
              const all: any = Elem.id("main")!.querySelectorAll("*");
              const results: string[] = [];
              const x_start = e.clientX + scrollLeft;
              const y_start = e.clientY + scrollTop;

              all.forEach((element: any) => {
                if (
                  Style.top(element.id) + scrollTop < y_start &&
                  Style.left(element.id) + scrollLeft < x_start &&
                  Style.right(element.id) + scrollLeft > x_start &&
                  Style.bottom(element.id) + scrollTop > y_start &&
                  (element.id === CANVAS ||
                    element.getAttribute("data-type") === "page")
                ) {
                  results.push(element.id);
                }
              });

              if (results.length == 1) {
                set_movingTo(results[0]);
              } else {
                set_movingTo(results[1]);
              }
            }
          }


          /**
           * this is realtime alignment feature relative to other components
           */

          // if(startMovingObject){
          //   // element center horizontal based on parent indicator
          //   const PARENT = Elem.id(seleElement)!.parentElement!.id;
          //   const PARENT_LEFT = Style.left(PARENT);
          //   const ELEMENT_LEFT = Style.left(seleElement)! + scrollLeft;

          // }

          /**
           * if selection of elements verified by two verifications
           * know this code will do:
           *    - identify which elements could be selected and register them
           *    - and tells the wrapper (for moving elements ) the information like
           *      what is it's position and size
           */
          if (selectionStarted && selectionStarted2) {
            const res = getCIArea(startSelectingFrom, includeSelectingUpto);
            set_selectedElements(res);

            // create a wrapper element
            if (res.length == 1) {
              // this means user selected one element only
              set_seleElement(res[0]);
              Elem.id(res[0])!.style.outline = '0.1vw solid rgb(107, 154, 255)';
            } else if (res.length > 1) {
              // this means user selected multiple elements only

              const startFromMax = { x: 20000, y: 2000000 };
              const includeUpToMax = { x: -20000, y: -200000 };

              res.forEach((each: string) => {
                // some variable to clean the code
                const eTop: number = Style.top(each);
                const eLeft: number = Style.left(each);
                const eRight: number = Style.right(each);
                const eBottom: number = Style.bottom(each);

                if (eTop < startFromMax.y) {
                  // the top minimum value of element
                  startFromMax.y = eTop;
                  console.log("top: " + eTop);
                }
                if (eLeft < startFromMax.x) {
                  // the left minimum value of element
                  startFromMax.x = eLeft;
                  console.log("left: " + eLeft);
                }
                if (eRight > includeUpToMax.x) {
                  // the right maximum value of element
                  includeUpToMax.x = eRight;
                  console.log("right " + eRight);
                }
                if (eBottom > includeUpToMax.y) {
                  // the bottom maximum value of element
                  includeUpToMax.y = eBottom;
                  console.log("bottom: " + eBottom);
                }
              });
              startFromMax.x += scrollLeft;
              startFromMax.y += scrollTop;
              includeUpToMax.x += scrollLeft;
              includeUpToMax.y += scrollTop;
              set_multiSelectedElementsWrapperDivStartFrom(startFromMax);
              set_multiSelectedElementsWrapperDivInclude(includeUpToMax);
              set_seleElement(MULTIPLE_ELEMENTS_WRAPPER);
            }
          }

          /**
           * if user is moving elements only not pages
           * we will actually move components inside the wrapper
           * wrapper in this code means the elements parent
           * if user's mouse starts grabbing the element from the out side (CANVAS)
           *        - when user enters pages we have to move the element inside the page
           *
           * if user's mouse starts grabbing the element from the inside (pages)
           *        - when user move the component to the outside (CANVAS) move the element to outside
           */

          if (startMovingObject || (selectionStarted2 && selectionStarted) || startResizing) {
            // for scroll up
            if (mousePosition.y < 50) {
              Elem.id(CANVAS)?.scrollBy({
                behavior: "instant",
                top: -15,
                left: 0,
              });
            }
            // for scroll down
            if (mousePosition.y > window.innerHeight - 50) {
              Elem.id(CANVAS)?.scrollBy({
                behavior: "instant",
                top: 15,
                left: 0,
              });
            }

            // for scroll left
            if (mousePosition.x < 50) {
              Elem.id(CANVAS)?.scrollBy({
                behavior: "instant",
                top: 0,
                left: -15,
              });
            }
            // for scroll right
            if (mousePosition.x > window.innerWidth - 50) {
              Elem.id(CANVAS)?.scrollBy({
                behavior: "instant",
                top: 0,
                left: 15,
              });
            }

            if (startMovingObject) {
              // if parent is canvas
              if(Elem.id(seleElement)!.parentElement!.id == CANVAS){
                Elem.id(seleElement)!.style.top = Unit.px(
                  (e.clientY + scrollTop) - objectCursorDifference.y
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  (e.clientX + scrollLeft) - objectCursorDifference.x
                );
              }else
              // if parent is page
              if(Elem.isPage(Elem.id(seleElement)!.parentElement!.id)){
                const parent_page = Elem.id(seleElement)!.parentElement!.id;
                Elem.id(seleElement)!.style.top = Unit.px(
                  (e.clientY - objectCursorDifference.y) - Style.top(parent_page)
                );
                Elem.id(seleElement)!.style.left = Unit.px(
                  (e.clientX - objectCursorDifference.x) - Style.left(parent_page)
                );
            }
          }

          /**
           * moving element from page to canvas and other features
           * are here
           */
    if (movingFrom !== movingTo && startMovingObject) {
      // moving single component features below
      
      Elem.id(seleElement)!.style.outline = "0.1vw solid rgb(107, 154, 255)";

      if (
        seleElement &&
        selectedElements.length < 2 &&
        seleElement !== MULTIPLE_ELEMENTS_WRAPPER
      ) {
        /* moving single component from CANVAS > page
         */
        if (
          movingFrom == CANVAS &&
          movingTo != CANVAS &&
          Elem.id(seleElement)!.getAttribute("data-type") !== "page"
          && seleElement !== MULTIPLE_ELEMENTS_WRAPPER
        ) {
          Elem.id(seleElement)!.style.outline = 'none';
          const clone: any = Elem.id(seleElement)!.cloneNode(true);
          clone.style.top = Unit.px(
            (e.clientY - objectCursorDifference.y) - Style.top(movingTo)
          );
          clone.style.left = Unit.px(
            (e.clientX - objectCursorDifference.x) - Style.left(movingTo)
          );
          Elem.id(seleElement)?.remove();
          Elem.id(movingTo)?.append(clone);
          // after that change states
          set_movingFrom(movingTo);
        }
        // moving single component from page > canvas
        if (
          movingFrom !== CANVAS &&
          movingTo == CANVAS &&
          Elem.id(seleElement)!.getAttribute("data-type") !== "page"
          && seleElement !== MULTIPLE_ELEMENTS_WRAPPER
        ) {
          const clone: any = Elem.id(seleElement)!.cloneNode(true);

          clone.style.top = Unit.px((e.clientY + scrollTop) - objectCursorDifference.y);
          clone.style.left = Unit.px((e.clientX + scrollLeft) - objectCursorDifference.x);
          Elem.id(seleElement)?.remove();
          Elem.id(CANVAS)?.append(clone);
          // after that change states
          set_movingFrom(CANVAS);
        }
        // moving single component from page > page
        if (
          movingFrom !== CANVAS &&
          movingTo !== CANVAS &&
          Elem.id(seleElement)!.getAttribute("data-type") !== "page" &&
          Elem.id(movingFrom)!.getAttribute("data-type") == "page" &&
          Elem.id(movingTo)!.getAttribute("data-type") == "page" &&
          seleElement !== MULTIPLE_ELEMENTS_WRAPPER
        ) {
          const clone: any = Elem.id(seleElement)!.cloneNode(true);

          clone.style.top = Unit.px((e.clientY - objectCursorDifference.y) - Style.top(movingTo));

          clone.style.left = Unit.px(
            (e.clientX - objectCursorDifference.x) - Style.left(movingTo)
          );
          set_movingTo(CANVAS)
          set_movingFrom(CANVAS)

          Elem.id(seleElement)?.remove();
          Elem.id(movingTo)?.append(clone);
          set_movingFrom(movingTo)
          
        }
      }


      if (
        selectedElements.length > 1 &&
        seleElement === MULTIPLE_ELEMENTS_WRAPPER
      ) {
        /* moving single component from CANVAS > page
         */
        /**
     * after user selects some component
     * we will clone them and do some edits
     * and append them to the wrapper (moving object wrapper)
     * this helps us to don't update position of each selected
     * element when we need to move them
     */
    if (selectedElements.length > 1 && Elem.id(movingTo)!.getAttribute('data-type') == PAGES_DATATYPE) {

      selectedElements.map((each: string) => {
        /**
         * we clone them b/c they will be removed from the previous position temporarily
         */
        const copy: any = Elem.id(each)!.cloneNode(true);
        /**
         * top and left position of the wrapper and CANVAS is different
         * that's why we update the elements position and append the new
         * one to the wrapper
         */
        copy.style.top = Unit.px((Style.top(each) - Style.top(movingTo)));
        copy.style.left = Unit.px(Style.left(each) - Style.left(movingTo));
        Elem.id(each)?.remove();
        Elem.id(movingTo)!.append(copy);
      });
      set_selectedElements([]);
      set_seleElement(movingTo);
    }
        
      }
      // set_startMovingObject(false);
      // set_selectionStarted(false);
      // set_selectionStarted2(false);
      
    }

        }}
      }
        style={{
          visibility: loading ? 'hidden' : 'visible'
        }}
      >

        <SpeedInsights />
        {/* bottom mode changes */}
        <div id={LEFT_TOOLS}
        onMouseDown={(e: any) => (e: any) => (e.target.tagName == 'INPUT' || e.target.isContentEditable) ? set_textEditingModeEnabled(true) : set_textEditingModeEnabled(false)}
        >
          <div
            style={{
              background: "white",
              position: "fixed",
              top: "12vh",
              left: "1vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "4vw",
              borderRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
              // rowGap: '0.5vw',
              borderBottom: "0.2vh solid gray",
              paddingBottom: "0.5vw",
            }}
          >
            <button title="Select"
            
            onClick={() => {
              mode == 'select' ? set_mode('') : set_mode('select');
              set_cursorStyle('default')
            }}
            className={mode == 'select' ? 'tool-selected' : ''}
            >
              <i className="bi bi-cursor"></i>
            </button>
            {/* move mode changer */}
            <button title="Move"
            onClick={() => {
              mode == 'move' ? set_mode('') : set_mode('move');
              set_cursorStyle('grab')
              set_seleElement('');
            }}
            className={mode == 'move' ? 'tool-selected' : ''}
            >
              <i className="bi bi-arrows-move"></i>
            </button>
          </div>
          {/* text mode changer */}
          <button title="text"
          onClick={() => {
            set_mode('text');
            set_cursorStyle('text');
            set_seleElement('');
          }}
          className={mode == 'text' ? 'tool-selected' : ''}
          >
            <i className="bi bi-fonts"></i>
          </button>
          <button title="image"
          onClick={() => {
            mode == 'image' ? set_mode('') : set_mode('image');
            set_cursorStyle('copy')
          }}
          className={mode == 'image' ? 'tool-selected' : ''}
          >
            <i className="bi bi-images"></i>
          </button>
          <button title="page">
            <i className="bi bi-phone"></i>
          </button>
          <button title="button">
            <i className="bi bi-menu-button-wide-fill"></i>
          </button>
          <button title="input">
            <i className="bi bi-input-cursor"></i>
          </button>
        </div>

        {/* upper tools */}
        {/*
         * currently it holds the logo
         */}
        <div 
          onMouseDown={(e: any) => (e: any) => (e.target.tagName == 'INPUT' || e.target.isContentEditable) ? set_textEditingModeEnabled(true) : set_textEditingModeEnabled(false)}
          id={UPPER_TOOLS}><div id={LOGO} />          
          <div style={{ fontSize: '1vw', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '700' }}>Workspace &gt;<input
          placeholder="Untitled"
          id={PROJECT_TITLE}
          contentEditable
          style={{ fontSize: '1vw', padding: '0.2vw', outline: 'none', textOverflow: 'ellipsis'}}
          onChange={(e: any) => document.querySelector('title')!.textContent = 'Hammer | ' + e.target.value}
          onFocus={() => set_textEditingModeEnabled(true)}
          /></div>
          
          {/* <button
          onClick={() => {
            const UTest = new UnitClassTest();
            UTest.test_px();
          }}
          >Test</button>
          <button
            onClick={() => set_textEditingModeEnabled(!textEditingModeEnabled)}
          >
            Text Edit Mode
          </button>
          <button onClick={() => set_displayDevStates(!displayDevStates)}>
            states
          </button>
          <button
            onClick={() =>
              Elem.id(CANVAS)!.scrollTo({
                top: Style.top("center"),
                left: Style.left("center"),
              })
            }
          >
            center
          </button> */}
        </div>

        {/* add new element */}
        {addNewElement && <div id="add-new-element"
                onMouseDown={(e: any) => (e: any) => (e.target.tagName == 'INPUT' || e.target.isContentEditable) ? set_textEditingModeEnabled(true) : set_textEditingModeEnabled(false)}
        >
                <input id="search-components" type="text" placeholder="Search Component"
                onChange={(e: any) => set_newElement(e.target.value)}
                value={newElement}
                onKeyDown={(e: any) => {
                  if(e.key == 'Enter'){
                    // set_addNewElement(false);
                    // set_newElement('');
                    set_textEditingModeEnabled(false);
                    for(let i = 0; i < componentsData.length; i++){
                      if(componentsData[i].tags.some((tag: any) => RegExp('^' + newElement).test(tag))){
                        set_newElement(componentsData[i].text)
                        break;
                      }
                    }
                    set_addNewElement(false);
                  }
                }}
                />

                {/* show all elements there is no searching */}
                {newElement.length == 0 && componentsData.map((each: any) => {
                  return <p
                  onClick={() => set_newElement(each.text)}
                  ><i className={each.className}></i> {each.text}</p>
                })}

                {/* filter elements */}
                {newElement.length > 0 && <> {componentsData.map((each: any) => {
                  const found = each.tags.some((tag: any) => RegExp('^' + newElement).test(tag));
                  if(found){
                  return <p
                  className="selected"
                    key={each.id}
                  onClick={() => set_newElement(each.text)}
                  ><i className={each.className}></i> {each.text}</p>
                  }
            })}
                </> 
                }

        </div>}


        {/* right-menu */}

        {(displayRightMenu && Elem.id(seleElement)! && Elem.id(seleElement)!.getAttribute('data-type') == PAGES_DATATYPE) && <div id="right-menu"
        onMouseDown={(e: any) => (e: any) => (e.target.tagName == 'INPUT' || e.target.isContentEditable) ? set_textEditingModeEnabled(true) : set_textEditingModeEnabled(false)}
        >

        {/* page configuration editing */}
        <h1>{Elem.id(seleElement)!.getAttribute('data-name')} <sup className="page">page</sup></h1>
        <label>ID: <input disabled value={page_id} type="text"/></label>
        <p>Title: <input type="text"
        value={title} placeholder={'ex: Home | AMCE'}
        onChange={(e: any) => {
          set_title(e.target.value) 
          Elem.setAttribute(seleElement, 'title', e.target.value)
        }}
        onFocus={() => set_textEditingModeEnabled(true)}
        /></p>
        <p>End Point: <input placeholder="ex: /home" type="text"
        onFocus={() => set_textEditingModeEnabled(true)}
        value={endpoint}
        onChange={(e: any) => {
          set_endpoint(e.target.value);
          Elem.id(seleElement)!.setAttribute('end-point', e.target.value);
        }}
        /></p>
        <p>Description: <textarea placeholder="Description"
        value={description}
        onFocus={() => set_textEditingModeEnabled(true)}
        onChange={(e: any) => {
          set_description(e.target.value)
          Elem.id(seleElement)!.setAttribute('end-point', e.target.value)
        }}
        /></p>
        <p>#Tags: <input placeholder="#topic" type="text" /></p>
        <div>{tags.map((each: any) => <span key={each}>{each}</span>)}</div>
        <p>Links: <input placeholder="links" type="text" /></p>
        <table>
          <tr><th>name</th><th>type</th><th>uri</th></tr>
          {links.map((each: any) => {
            return <tr key={each.id}><td>{each.name}</td><td>{each.type}</td><td>{each.uri}</td></tr>
          })}
        </table>
        <p>Scripts: <input placeholder="scripts" type="text" /></p>
        <table>
          <tr><th>name</th><th>type</th><th>uri</th></tr>
          {scripts.map((each: any) => {
            return <tr key={each.id}><td>{each.name}</td><td>{each.type}</td><td>{each.uri}</td></tr>
          })}
        </table>
        <button
        > Save</button>
        <button
        onClick={() => {
          set_displayRightMenu(false);
        }}
        className="close"
        style={{ right: '6vw'}}>Close</button>
        </div>}

        {/* CANVAS */}
        <div
          id={CANVAS}
          style={{
            cursor: cursorStyle,
          }}
          /**
           * tabIndex is assigned to -1 to make it focusable element for
           * features like keyboard and mouse
           */
          tabIndex={-1}
          /**
           * draggable is bad for images for dev environment not production
           */
          draggable={false}
          
          onMouseDown={(e: any) => {
            const id = e.target.id == '' ? e.target.parentElement.id : e.target.id;
            const data_type = Elem.getAtt(id, 'data-type') || Component.name(Elem.id(id)!);
            const contentEditable = Elem.id(id)!.isContentEditable;
            const parent = Elem.id(id)!.parentElement!.id;
            const isPage = Elem.getAtt(id, 'data-type') === PAGES_DATATYPE;

            (Elem.id(id)!.tagName == 'INPUT' || Elem.id(id)!.isContentEditable) ? set_textEditingModeEnabled(true) : set_textEditingModeEnabled(false);

            // save element state and config
            const element_state: any = {};
            element_state.id = id;
            element_state.data_type = data_type;
            element_state.contentEditable = contentEditable;
            element_state.parent = parent;
            element_state.isPage = isPage;

            // now update the state 
            set_element_config(element_state);
            set_element_style(getComputedStyle(Elem.id(id)!));
            console.log(element_config);

            if(mode === 'move'){
              // moving the canvas feature
            set_startMovingFeature(true);
            }
            
            // outline element
            if(Elem.id(id)!.parentElement!.id == CANVAS && mode == 'select'){
              Elem.id(id)!.style.outline = '0.1vw solid rgb(107, 154, 255)';
            }
            if(id !== seleElement){
              Elem.id(seleElement)!.style.outline = 'none';
            }
            
            // text editing mode
            if(
              logic.notInExceptions(id, [ CANVAS, MULTIPLE_ELEMENTS_WRAPPER ]) 
              && 
              Elem.id(id)!.getAttribute('data-type') !== PAGES_DATATYPE
              &&
              mode == 'text'
              &&
              Component.name(Elem.id(id)!) !== 'Button'
              &&
              Component.name(Elem.id(id)!) !== 'Video'
              ){
              // if user needs to edit text
              Elem.id(id)!.setAttribute('contenteditable', 'true')
              set_textEditingModeEnabled(true);
            }else {
              if(
                mode == 'text' 
                && 
                !textEditingModeEnabled
                &&
                Component.name(Elem.id(id)!) !== 'Button'
                &&
                Component.name(Elem.id(id)!) !== 'Video'  
                ){
                Elem.id(seleElement)!.setAttribute('contenteditable', 'false');
                Elem.id(id)!.setAttribute('contenteditable', 'false');
                set_mode('select');
                set_textEditingModeEnabled(false);
                // creating a text element on selected path
                const element = document.createElement('p');
                const new_id = 'p' + Date.now();
                element.style.position = 'absolute';
                element.style.width = 'fit-content';
                element.style.height = 'fit-content';
                element.style.overflow = 'auto';
                element.style.lineBreak = 'no-break';
                element.style.background = 'none';
                element.style.outline = '0.1vw solid rgb(107, 154, 255)'


                if(id === CANVAS){
                  element.style.top = Unit.px(e.clientY + scrollTop);
                  element.style.left = Unit.px(e.clientX + scrollLeft);
                }else if(Elem.isPage(id)){
                  element.style.top = Unit.px(e.clientY - Style.top(id));
                  element.style.left = Unit.px(e.clientX - Style.left(id));
                }
                element.id = new_id;
                Elem.id(id)!.append(element);
                set_seleElement(new_id);
                element.setAttribute('contenteditable', 'true')
                setTimeout(() => focusOn(new_id), 100)
                set_textEditingModeEnabled(true)
              }else if(mode == 'text') {
              Elem.id(id)!.setAttribute('contenteditable', 'false');  
              set_textEditingModeEnabled(false);
              set_mode('select')
            }
            }


            // opened content editable element remover
            if(Elem.isContentEditable(seleElement) && seleElement !== e.target.id)
            {
              Elem.isContentEditable(seleElement, 'false');
              set_textEditingModeEnabled(false);
            }
            
            // ui effect on cursor
            cursorStyle == 'grab' ? set_cursorStyle('grabbing') : set_cursorStyle('default');


            // some checks
            const isCanvas: boolean = id === CANVAS ? true : false;
            // let isItsParentCanvas = Elem.id(id)!.parentElement!.id === CANVAS ? true : false;
            /**
             * register where the selected elements from
             * [ simply the parent of the element by the time they touched by pointer ]
             */
            if (!isCanvas) {
              // if this element is not CANVAS
              set_movingFrom(Elem.id(id)!.parentElement!.id);
              set_movingTo(Elem.id(id)!.parentElement!.id);
            }
            set_fromWhereAreTheComponent(
              Elem.id(e.target.id)!.parentElement!.id
            );

            /**
             * the code below must be cleaners
             * cleaners are codes who reset opened things if we user needs to close them easily
             * simply they reset states
             */
            set_displayContext(false);

            /*
             * this is after user selects and do his thing
             * and he needs to stop selection
             * we identify that by
             *   1. if there are selected elements
             *   2. if selected element is not the wrapper (the selection box)
             *   3. if user doesn't user shiftKey ( because he might be making an element part of selection or removing element from selected ones)
             *
             */
            if (
              selectedElements.length > 1 &&
              id !== MULTIPLE_ELEMENTS_WRAPPER &&
              !e.shiftKey && movingTo === CANVAS
            ) {
              // if user selects something before append those to the real dom

              /**
               * this makes a clone of elements in wrapper and
               * append them to there original place like (CANVAS & page)
               *
               */
              selectedElements.map((each: string) => {
                const copy: any = Elem.id(each)!.cloneNode(true);
                copy.style.top = Unit.px(Style.top(each) + scrollTop);
                copy.style.left = Unit.px(Style.left(each) + scrollLeft);
                set_selectedElements([]);
                Elem.id(each)?.remove();
                Elem.id(CANVAS)!.append(copy);
              });
            }

            /**
             * this is the component who register the element selected if the element is not the exception
             * select is the blue box who follows you when you are selecting the elements in the ui
             */
            if (id !== "select" && mode == 'select') {
              set_seleElement(id);
            }

            /**
             * this is for moving object feature
             * this helps to find the difference with cursor and moving object
             * this value is the one who helped as to move the element with respect to referencing point in it
             */
            if (id !== CANVAS) {
              // simplify this and make it more easier to manipulate by just using the Style.[side] method
              set_objectCursorDifference({ x: e.clientX - Style.left(id), y: e.clientY - Style.top(id)})

              if(mode == 'select'){
                set_startMovingObject(true);
              }
            }

            /**
             * this is all about selecting element feature
             * this works if you put pointer in the CANVAS
             */
            if (mode == 'select' && (e.target.id === CANVAS)) {
              // if CANVAS is working
              set_movingFrom(CANVAS);
              set_movingTo(CANVAS);

              /**
               * selection type is important for future features
               * because we need to separate text editing selection and component selection
               * this prevents crush when users need to edit text and when they select the text
               */
              set_selectionType("components");
              /**
               * set_startSelectingFrom
               * identifies where user needs to start selecting from
               */
              set_startSelectingFrom({
                x: e.clientX + scrollLeft,
                y: e.clientY + scrollTop,
              });

              /**
               * set_includeSelectingUpto
               * identifies how far selecting includes
               * or the end of selection
               */
              set_includeSelectingUpto({
                x: e.clientX + scrollLeft,
                y: e.clientY + scrollTop,
              });
              /**
               * set_selectionStarted
               * this announces the user started selecting
               * but this doesn't mean the "select" div displays instead
               * we need another check called "set_selectionStarted2" which will be enabled
               * when user starts moving his mouse at first time after this enabled
               */
              set_selectionStarted(true);
              /**
               * this clears the selected components
               * user's action tells us he needs to ungrouped those components
               */
              set_selectedElements([]);
            }

            // this reference maker should update when user clicks something
            set_visibleComponents(
              screenVisibleElements(
                Style.height(UPPER_TOOLS),
                0,
                window.innerWidth,
                window.innerHeight
              )
            );
            
            console.log("------------- mouse down event completed --------------")
          }}
          onWheel={(e: WheelEvent) => {
            // updating user's scroll amount
            set_scrollTop(Scroll.top(CANVAS)!);
            set_scrollLeft(Scroll.left(CANVAS)!);
            console.log(e)
            Elem.id(CANVAS)!.scrollBy({
              behavior: "instant",
              top: e.movementY,
              left: e.movementX,
            });
          }}

        >
          {/* this makes the scrolling feature possible */}
          <div
            style={{
              position: "absolute",
              top: Unit.px(window.innerHeight + scrollTop + 200000),
              left: Unit.px(window.innerWidth + scrollLeft + 200000),
              width: "10px",
              height: "10px",
              background: "transparent",
              pointerEvents: "none",
            }}
          ></div>

          <button
          tabIndex={-1}
            id="btn"
            style={{
              position: "absolute",
              top: "10100px",
              left: "10100px",
              padding: "10px 20px",
              zIndex: 3,
              width: "150px",
              background: "black",
              color: "white",
            }}
          >
            Click Here
          </button>

          <div
            id="page-0"
            data-name="Home"
            data-type="page"
            style={{
              width: "480px",
              height: "800px",
              top: "10100px",
              left: "10100px",
              background: "white",
              position: "absolute",
              zIndex: 0,
            }}
          >


<svg id="second-svg" style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 6}} width="100px" height="100px" viewBox="0 0 24 24" fill="gold" xmlns="http://www.w3.org/2000/svg">
<path d="M20 16V8.5C20 7.67157 19.3587 7 18.5195 7C18 7 17 7.3 17 8.5V5.5C17 4.67157 16.3588 4 15.5195 4C15.013 4 14 4.3 14 5.5V3.5C14 2.67157 13.3588 2 12.5195 2C11.6803 2 11 2.67157 11 3.5V5.5C11 4.3 10.0065 4 9.5 4C8.66076 4 8 4.69115 8 5.51957L8.00004 14" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11 5.5V11" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 5.5V11" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 5.5V11" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 16C20 20 16.866 22 13 22C9.13401 22 7.80428 21 4.80428 16L3.23281 13.3949C2.69684 12.5274 3.1259 11.4011 4.11416 11.0812C4.77908 10.866 5.51122 11.0881 5.93175 11.6326L8 14.0325" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


            <img
              id="img-01"
              draggable="false"
              style={{
                zIndex: 2,
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "200px",
              }}
              src="https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg"
              alt="the image"
            />
            <img
              style={{
                zIndex: 3,
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "200px",
              }}
              draggable="false"
              src="/mobile (1).gif"
              alt="logo"
              id="img-02"
            />
          </div>

          <div id="wrapper"
          data-type='mask'
           style={{
              width: "300px",
              height: "480px",
              top: "10400px",
              left: "10600px",
              background: "lightblue",
              position: "absolute",
              zIndex: 0,
            }}>

          </div>

          <div
            id="page-1"
            data-type="page"
            data-name="About"
            style={{
              width: "360px",
              height: "780px",
              top: "10100px",
              left: "10600px",
              background: "white",
              position: "absolute",
              zIndex: 0,
            }}
          >

          <svg id="microsoft-logo"
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px'
          }}
          viewBox="939.813 1185 1400 472" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="var(--quaternary-color)" role="img" aria-labelledby="microsoft-logo-label"><title id="microsoft-logo-label">Microsoft</title><g><path d=" M 1430.669 1446.063 L 1422.38 1469.547 L 1421.69 1469.547 C 1420.308 1464.251 1417.776 1456.193 1413.631 1446.523 L 1369.196 1334.86 L 1325.683 1334.86 L 1325.683 1512.83 L 1354.462 1512.83 L 1354.462 1403.009 C 1354.462 1396.102 1354.462 1388.274 1354.231 1378.605 C 1354.001 1373.77 1353.541 1370.086 1353.31 1367.323 L 1354.001 1367.323 C 1355.383 1374.23 1356.994 1379.295 1358.145 1382.519 L 1411.559 1512.37 L 1431.82 1512.37 L 1484.773 1381.367 C 1485.924 1378.374 1487.076 1372.388 1488.227 1367.323 L 1488.917 1367.323 C 1488.227 1380.447 1487.766 1392.188 1487.536 1399.326 L 1487.536 1512.14 L 1518.157 1512.14 L 1518.157 1334.4 L 1476.255 1334.4 L 1430.669 1446.063 L 1430.669 1446.063 Z  M 1547.166 1384.591 L 1577.096 1384.591 L 1577.096 1512.14 L 1547.166 1512.14 L 1547.166 1384.591 Z  M 1562.362 1330.716 C 1557.297 1330.716 1553.152 1332.558 1549.699 1335.781 C 1546.245 1339.005 1544.403 1343.149 1544.403 1348.214 C 1544.403 1353.049 1546.245 1357.193 1549.699 1360.416 C 1553.152 1363.64 1557.297 1365.251 1562.362 1365.251 C 1567.427 1365.251 1571.801 1363.409 1575.024 1360.416 C 1578.478 1357.193 1580.32 1353.049 1580.32 1348.214 C 1580.32 1343.379 1578.478 1339.235 1575.024 1335.781 C 1572.031 1332.558 1567.657 1330.716 1562.362 1330.716 Z  M 1683.234 1383.44 C 1677.708 1382.288 1671.952 1381.598 1666.427 1381.598 C 1652.843 1381.598 1640.41 1384.591 1630.05 1390.577 C 1619.689 1396.563 1611.401 1404.851 1606.106 1415.212 C 1600.58 1425.802 1597.817 1438.005 1597.817 1452.049 C 1597.817 1464.251 1600.58 1475.072 1605.876 1484.972 C 1611.171 1494.642 1618.538 1502.47 1628.438 1507.765 C 1637.878 1513.06 1648.929 1515.823 1661.362 1515.823 C 1675.636 1515.823 1687.838 1512.83 1697.508 1507.305 L 1697.738 1507.074 L 1697.738 1479.447 L 1696.587 1480.367 C 1692.213 1483.591 1687.148 1486.353 1682.083 1487.965 C 1676.787 1489.807 1671.952 1490.728 1667.808 1490.728 C 1655.836 1490.728 1646.396 1487.274 1639.72 1479.677 C 1632.813 1472.309 1629.359 1462.179 1629.359 1449.516 C 1629.359 1436.393 1632.813 1426.033 1639.95 1418.435 C 1647.087 1410.837 1656.527 1406.923 1668.038 1406.923 C 1677.708 1406.923 1687.608 1410.147 1696.587 1416.593 L 1697.738 1417.514 L 1697.738 1388.274 L 1697.508 1388.044 C 1693.594 1386.433 1689.22 1384.591 1683.234 1383.44 M 1782.003 1382.519 C 1774.636 1382.519 1767.729 1384.821 1761.743 1389.656 C 1756.678 1393.8 1753.224 1399.786 1750.231 1406.923 L 1750.001 1406.923 L 1750.001 1384.591 L 1720.071 1384.591 L 1720.071 1512.14 L 1750.001 1512.14 L 1750.001 1446.984 C 1750.001 1435.933 1752.303 1426.723 1757.369 1420.047 C 1762.434 1413.14 1768.88 1409.686 1776.708 1409.686 C 1779.471 1409.686 1782.234 1410.377 1785.687 1410.837 C 1788.91 1411.758 1791.213 1412.679 1792.824 1413.83 L 1793.976 1414.751 L 1793.976 1384.821 L 1793.285 1384.591 C 1791.213 1383.209 1787.069 1382.519 1782.003 1382.519 M 1863.506 1381.828 C 1842.555 1381.828 1825.748 1388.044 1814.006 1400.247 C 1802.034 1412.449 1796.278 1429.256 1796.278 1450.437 C 1796.278 1470.237 1802.264 1486.353 1813.776 1498.095 C 1825.287 1509.607 1840.943 1515.593 1860.513 1515.593 C 1881.003 1515.593 1897.35 1509.377 1909.092 1496.944 C 1921.064 1484.512 1926.82 1467.935 1926.82 1447.444 C 1926.82 1427.184 1921.294 1411.067 1910.013 1399.326 C 1899.192 1387.584 1883.306 1381.828 1863.506 1381.828 M 1887.45 1479.907 C 1881.924 1487.044 1873.176 1490.498 1862.355 1490.498 C 1851.534 1490.498 1842.785 1487.044 1836.569 1479.447 C 1830.352 1472.309 1827.359 1461.949 1827.359 1448.826 C 1827.359 1435.242 1830.583 1424.881 1836.569 1417.514 C 1842.785 1410.147 1851.303 1406.463 1862.124 1406.463 C 1872.715 1406.463 1881.003 1409.916 1886.989 1417.053 C 1892.976 1424.191 1896.199 1434.551 1896.199 1448.135 C 1895.738 1461.949 1893.206 1472.77 1887.45 1479.907 M 1993.587 1437.544 C 1984.148 1433.63 1978.162 1430.637 1975.399 1428.105 C 1973.096 1425.802 1971.945 1422.579 1971.945 1418.435 C 1971.945 1414.981 1973.327 1411.528 1976.78 1409.226 C 1980.234 1406.923 1984.148 1405.772 1989.903 1405.772 C 1994.969 1405.772 2000.264 1406.693 2005.329 1408.074 C 2010.394 1409.456 2014.999 1411.528 2018.683 1414.291 L 2019.834 1415.212 L 2019.834 1387.123 L 2019.143 1386.893 C 2015.689 1385.512 2011.085 1384.13 2005.559 1382.979 C 2000.034 1382.058 1994.969 1381.598 1990.824 1381.598 C 1976.55 1381.598 1964.808 1385.051 1955.599 1392.649 C 1946.39 1399.786 1942.015 1409.456 1942.015 1420.737 C 1942.015 1426.723 1942.936 1432.019 1945.008 1436.393 C 1947.08 1440.767 1950.073 1444.912 1954.217 1448.365 C 1958.362 1451.588 1964.348 1455.272 1972.636 1458.726 C 1979.543 1461.719 1984.838 1464.021 1988.062 1465.863 C 1991.285 1467.705 1993.357 1469.777 1994.969 1471.388 C 1996.12 1473.23 1996.81 1475.533 1996.81 1478.526 C 1996.81 1487.044 1990.364 1491.188 1977.241 1491.188 C 1972.176 1491.188 1966.88 1490.267 1960.664 1488.195 C 1954.448 1486.123 1948.692 1483.13 1943.857 1479.677 L 1942.706 1478.756 L 1942.706 1507.995 L 1943.396 1508.226 C 1947.771 1510.298 1953.066 1511.679 1959.513 1513.291 C 1965.959 1514.442 1971.715 1515.363 1976.78 1515.363 C 1992.206 1515.363 2004.869 1511.909 2013.848 1504.312 C 2023.057 1496.944 2027.892 1487.505 2027.892 1475.302 C 2027.892 1466.784 2025.59 1459.186 2020.524 1453.43 C 2013.848 1447.905 2005.559 1442.149 1993.587 1437.544 M 2106.862 1381.828 C 2085.91 1381.828 2069.103 1388.044 2057.362 1400.247 C 2045.62 1412.449 2039.634 1429.256 2039.634 1450.437 C 2039.634 1470.237 2045.62 1486.353 2057.131 1498.095 C 2068.643 1509.607 2084.299 1515.593 2103.869 1515.593 C 2124.359 1515.593 2140.706 1509.377 2152.448 1496.944 C 2164.42 1484.512 2170.176 1467.935 2170.176 1447.444 C 2170.176 1427.184 2164.65 1411.067 2153.369 1399.326 C 2142.548 1387.584 2126.662 1381.828 2106.862 1381.828 M 2130.576 1479.907 C 2125.05 1487.044 2116.301 1490.498 2105.48 1490.498 C 2094.429 1490.498 2085.91 1487.044 2079.694 1479.447 C 2073.478 1472.309 2070.485 1461.949 2070.485 1448.826 C 2070.485 1435.242 2073.708 1424.881 2079.694 1417.514 C 2085.91 1410.147 2094.429 1406.463 2105.25 1406.463 C 2115.61 1406.463 2124.129 1409.916 2130.115 1417.053 C 2136.101 1424.191 2139.324 1434.551 2139.324 1448.135 C 2139.324 1461.949 2136.331 1472.77 2130.576 1479.907 M 2330.187 1409.226 L 2330.187 1384.591 L 2300.027 1384.591 L 2300.027 1346.833 L 2299.106 1347.063 L 2270.557 1355.581 L 2269.866 1355.812 L 2269.866 1384.591 L 2224.741 1384.591 L 2224.741 1368.474 C 2224.741 1361.107 2226.583 1355.351 2229.806 1351.667 C 2233.029 1347.984 2237.864 1346.142 2243.85 1346.142 C 2247.994 1346.142 2252.369 1347.063 2257.203 1349.135 L 2258.355 1349.826 L 2258.355 1323.809 L 2257.664 1323.579 C 2253.52 1322.198 2247.994 1321.277 2240.857 1321.277 C 2231.878 1321.277 2224.05 1323.349 2216.913 1326.802 C 2209.775 1330.716 2204.48 1336.012 2200.566 1343.149 C 2196.652 1350.056 2194.58 1357.884 2194.58 1366.863 L 2194.58 1384.591 L 2173.629 1384.591 L 2173.629 1408.995 L 2194.58 1408.995 L 2194.58 1512.14 L 2224.741 1512.14 L 2224.741 1409.226 L 2269.866 1409.226 L 2269.866 1474.842 C 2269.866 1501.779 2282.529 1515.363 2307.855 1515.363 C 2311.999 1515.363 2316.373 1514.672 2320.517 1513.981 C 2324.892 1513.06 2328.115 1511.909 2329.957 1510.988 L 2330.187 1510.758 L 2330.187 1486.123 L 2329.036 1487.044 C 2327.194 1488.195 2325.583 1489.116 2322.82 1489.807 C 2320.517 1490.498 2318.445 1490.728 2316.834 1490.728 C 2310.848 1490.728 2306.703 1489.347 2303.71 1485.893 C 2300.948 1482.67 2299.566 1477.374 2299.566 1469.547 L 2299.566 1409.226 L 2330.187 1409.226 L 2330.187 1409.226 Z "></path><path d=" M 939.813 1275 L 1080.945 1275 L 1080.945 1416.133 L 939.813 1416.133 L 939.813 1275 Z "></path><path d=" M 1095.68 1275 L 1236.813 1275 L 1236.813 1416.133 L 1095.68 1416.133 L 1095.68 1275 Z "></path><path d=" M 939.813 1430.867 L 1080.945 1430.867 L 1080.945 1572 L 939.813 1572 L 939.813 1430.867 Z "></path><path d=" M 1095.68 1430.867 L 1236.813 1430.867 L 1236.813 1572 L 1095.68 1572 L 1095.68 1430.867 Z "></path></g></svg>

            <div id="video"
            data-type="video"
            style={{
              position: 'absolute',
              width: '160px',
              height: '100px',
              top: '10px',
              left: '10px',
              background: 'white'
            }}
            >
<iframe src="https://www.youtube.com/embed/IKqV7DB8Iwg?si=ArWkFG2GkR_U06Dw" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>            </div>

            <h1
              style={{
                fontSize: "42px",
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "300px",
                zIndex: 0,
              }}
              id="title-inside-page"
            >
              Hello I'm Page
            </h1>
            <img
              id="img-03"
              draggable="false"
              style={{
                zIndex: 2,
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "200px",
              }}
              src="/logo.svg"
              alt="the image"
            />
            <img
              style={{
                zIndex: 3,
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "200px",
              }}
              draggable="false"
              src="/add-button.png"
              alt="logo"
              id="img-04"
            />
          </div>


 {/* align indicators */}

 <div 
              style={{
                background: 'rgba(255, 0, 0, 0.5)',
                zIndex: 5000,
                width: '1px',
                height: '2000px',
                position: 'absolute',
                top: '10500px',
                left: '10500px'
              }}
          />
          <div

              style={{
                background: 'rgba(255, 0, 0, 1)',
                zIndex: 5000,
                width: '5px',
                height: '5px',
                position: 'absolute',
                top: '10498px',
                left: '10498px',
                borderRadius: '50%'
              }}
              id='indicator'
          />


          {/* dev components*/}
          {selectionStarted &&
            selectionStarted2 &&
            selectionType == "components" && (
              <div
                id="select"
                style={{
                  position: "absolute",
                  top:
                    includeSelectingUpto.y > startSelectingFrom.y
                      ? Unit.px(startSelectingFrom.y)
                      : Unit.px(includeSelectingUpto.y),
                  left:
                    includeSelectingUpto.x > startSelectingFrom.x
                      ? Unit.px(startSelectingFrom.x)
                      : Unit.px(includeSelectingUpto.x),
                  width:
                    includeSelectingUpto.x > startSelectingFrom.x
                      ? Unit.px(includeSelectingUpto.x - startSelectingFrom.x)
                      : Unit.px(startSelectingFrom.x - includeSelectingUpto.x),
                  height:
                    includeSelectingUpto.y > startSelectingFrom.y
                      ? Unit.px(includeSelectingUpto.y - startSelectingFrom.y)
                      : Unit.px(startSelectingFrom.y - includeSelectingUpto.y),
                }}
              ></div>
            )}

          {selectedElements.length > 1 && (
            <div
              id={MULTIPLE_ELEMENTS_WRAPPER}
              style={{
                position: "absolute",
                top: Unit.px(multiSelectedElementsWrapperDivStartFrom.y),
                left: Unit.px(multiSelectedElementsWrapperDivStartFrom.x),
                width: Unit.px(
                  multiSelectedElementsWrapperDivInclude.x -
                    multiSelectedElementsWrapperDivStartFrom.x
                ),
                height: Unit.px(
                  multiSelectedElementsWrapperDivInclude.y -
                    multiSelectedElementsWrapperDivStartFrom.y
                ),
                zIndex: 50000,
              }}
            ></div>
          )}
        </div>

        {/* scale reference */}
        <div id={REFERENCE}
        style={{
          width: '0px',
          position: 'fixed',
          top: '0px',
          left: '100vw',
          pointerEvents: 'none'
        }}
        ></div>

        {/* scale reference box */}
        <div id="scale-reference" style={{ width: '1vh', height: '1vh'}} />



        {Elem.id(seleElement) && <div id="design-tools">
          <details open>
            <summary>Position</summary>
            {/* those are the alignment options */}
            <div id="align-handv"> {/* horizontal align then vertical alignment */}
              <button className="tool-btn"><AlignHorizontalLeft /></button>
              <button className="tool-btn"><AlignHorizontalCenter /></button>
              <button className="tool-btn"><AlignHorizontalRight/></button>
              <button className="tool-btn"><AlignVerticalTop/></button>
              <button className="tool-btn"><AlignVerticalCenter/></button>
              <button className="tool-btn"><AlignVerticalBottom/></button>
            </div>
          </details>
          <hr />
          <div className="flex-row">
          <div className="flex-row"><span>X</span> <input type="number"/></div>
          <div className="flex-row"><span>Y</span> <input type="number"/></div>
          </div>
          <div className="flex-row">
          <div className="flex-row"><span>W</span> <input type="number"/></div>
          <div className="flex-row"><span>H</span> <input type="number"/></div>
          </div>
          <hr />
          <details open>
            <summary
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            >Fill 
            <div className="flex-row">
            <button className="tool-btn"><Apps/></button><button className="tool-btn"><Add/></button>
            </div>
            </summary>
            <div className="list-layer flex-row">
              <div style={{ background: Style.backgroundColor(seleElement)}} className="fill-display"></div>
              <input className="value" value={element_style.background} onChange={(e: any) => {
                Style.backgroundColor(seleElement, e.target.value)
                }} />
              <div className="opacity"></div>
              <button className='tool-btn'><Visibility/></button>
              <button className='tool-btn'><Remove/></button>
            </div>

            <div className="list-layer flex-row">
              <div style={{ background: 'linear-gradient(45deg, red, blue)'}} className="fill-display"></div>
              <input className="value" value={element_style.background} />
              <div className="opacity"></div>
              <button className='tool-btn'><Visibility/></button>
              <button className='tool-btn'><Remove/></button>
            </div>

          </details>
          <hr />
          <details open={true}>
            <summary>Typography</summary>
            <InputSection
            applyTo={'color'}
            element={seleElement}
            value={Elem.id(seleElement)!.style.color}
            label={'color'} type={'color-and-text'} />
            <InputSection
            applyTo={'fill'}
            element={seleElement}
            value={Elem.id(seleElement)!.style.fill}
            label={'Fill'} type={'color-and-text'} />
            <InputSection label={'font'} type={'selection'} options={[ {name: 'Calibri', value: 'calibri', key: 0 }]} />
            <InputSection applyTo={'font-weight'} element={seleElement} label={'weight'} type={'text'} options={[ {name: 'Light', value: 100, key: 0 }]} />
            <InputSection applyTo={'font-size'} element={seleElement} label={'size'} type={'text'} options={[ {name: 'Arial', value: 'arial', key: 0 }]} />
            <InputSection label={'transform'} type={'selection'} options={[ {name: 'Arial', value: 'arial', key: 0 }]} />
          </details>
        </div>}

        {/* 
      states are a key value pairs of useState hooks list 
      those display the value in real time
      */}
        {/* root states */}
        {displayDevStates && (
          <table id={STATES}>
            <tbody>
              <tr>
                <td>previous_key</td>
                <td>{previous_key}</td>
              </tr>
              <tr>
                <td>movingFrom</td>
                <td>{movingFrom}</td>
              </tr>
              <tr>
                <td>movingTo</td>
                <td>{movingTo}</td>
              </tr>
              <tr>
                <td>fromWhereAreTheComponent</td>
                <td>{fromWhereAreTheComponent}</td>
              </tr>
              <tr>
                <th>state</th>
                <th>value</th>
              </tr>
              <tr>
                <td>scrollTop</td>
                <td>{scrollTop}</td>
              </tr>

              <tr>
                <td>scrollLeft</td>
                <td>{scrollLeft}</td>
              </tr>

              <tr>
                <td>selectionStarted</td>
                <td>{selectionStarted ? "🟢" : "🔴"}</td>
              </tr>

              <tr>
                <td>selectionStarted2</td>
                <td>{selectionStarted2 ? "🟢" : "🔴"}</td>
              </tr>

              <tr>
                <td>selectionType</td>
                <td>{selectionType}</td>
              </tr>

              <tr>
                <td>startSelectingFrom</td>
                <td>
                  X:{startSelectingFrom.x} <br />
                  Y:{startSelectingFrom.y}
                </td>
              </tr>

              <tr>
                <td>includesSelectingUpto</td>
                <td>
                  X:{includeSelectingUpto.x} <br />
                  Y:{includeSelectingUpto.y}
                </td>
              </tr>

              <tr>
                <td>selectedElements</td>
                <td>
                  {selectedElements.map((each: string) => (
                    <p key={each}>{each}</p>
                  ))}
                </td>
              </tr>

              <tr>
                <td>multiSelectedElementsWrapperDivStartFrom</td>
                <td>
                  X:{multiSelectedElementsWrapperDivStartFrom.x} <br />
                  Y: {multiSelectedElementsWrapperDivStartFrom.y}
                </td>
              </tr>

              <tr>
                <td>multiSelectedElementsWrapperDivInclude</td>
                <td>
                  X:{multiSelectedElementsWrapperDivInclude.x} <br />
                  Y: {multiSelectedElementsWrapperDivInclude.y}
                </td>
              </tr>
              <tr>
                <td>startResizing</td>
                <td>{startResizing ? "🟢" : "🔴"}</td>
              </tr>

              <tr>
                <td>whatToResize</td>
                <td>{whatToResize}</td>
              </tr>

              <tr>
                <td>seleElement</td>
                <td>{seleElement}</td>
              </tr>

              <tr>
                <td>cursorStyle</td>
                <td>{cursorStyle}</td>
              </tr>

              <tr>
                <td>startMovingObject</td>
                <td>{startMovingObject ? "🟢" : "🔴"}</td>
              </tr>

              <tr>
                <td>objectCursorDifference</td>
                <td>
                  X: {objectCursorDifference.x} <br />
                  Y: {objectCursorDifference.y}
                </td>
              </tr>

              <tr>
                <td>textEditingModeEnabled</td>
                <td>{textEditingModeEnabled ? "🟢" : "🔴"}</td>
              </tr>

              <tr>
                <td>displayContext</td>
                <td>{displayContext ? "🟢" : "🔴"}</td>
              </tr>

              <tr>
                <td>contextMenuPosition</td>
                <td>
                  X: {contextMenuPosition.x} <br />
                  Y: {contextMenuPosition.y}
                </td>
              </tr>

              <tr>
                <td>mousePosition</td>
                <td>
                  X: {mousePosition.x} <br />
                  Y: {mousePosition.y}
                </td>
              </tr>

              <tr>
                <td>window</td>
                <td>
                  height: {window.innerHeight} <br />
                  width: {window.innerWidth} <br />
                </td>
              </tr>
              <tr>
                <td>mode</td>
                <td>{mode}</td>
              </tr>
            </tbody>
          </table>
        )}

        <div id="components">

        </div>

        {9 < 5 && <div
          id="visible-elements"
          style={{
            position: "fixed",
            left: "0px",
            bottom: "0px",
            background: "white",
            width: "100px",
            height: "fit-content",
            minHeight: "200px",
          }}
        >
          {visibleComponents.map((each: any) => {
            return (
              <button className="width-full bg-primary text-white">
                {each}
              </button>
            );
          })}
        </div>}

        {displayDevStates && (
          <table id="states" style={{ right: "350px", height: "fit-content" }}>
            <caption>Element State</caption>
            <tbody>
              <tr>
                <th>name</th>
                <th>value</th>
              </tr>
              <tr>
                <td>id</td>
                <td>{seleElement}</td>
              </tr>
              <tr>
                <td>width</td>
                <td>{Style.width(seleElement)}</td>
              </tr>
              <tr>
                <td>height</td>
                <td>{Style.height(seleElement)}</td>
              </tr>
              <tr>
                <td>position value</td>
                <td>
                  l: {Style.left(seleElement)!}
                  <br />
                  t: {Style.top(seleElement)!}
                  <br />
                  r: {Style.right(seleElement)!}
                  <br />
                  b: {Style.bottom(seleElement)}
                  
                </td>
              </tr>
              <tr>
                <td>zIndex</td>
                <td>{Style.zIndex(seleElement)}</td>
              </tr>
            </tbody>
          </table>
        )}

        {/* those are element feature previewers and decorators */}
        {
          (document.getElementById(seleElement) &&
          seleElement !== CANVAS &&
          !startMovingObject &&
          !startResizing
          ) && (
            <div id={DECORATORS}>
              {/* element descriptor */}
              {Elem.id(seleElement) && (
                <div
                  style={{
                    position: "absolute",
                    top: `calc(${Style.top(seleElement)}px - 1.5vw)`,
                    left: Unit.px(Style.left(seleElement)),
                    width: "fit-content",
                    height: "fit-content",
                    zIndex: 30,
                    background: "transparent",
                    fontSize: "0.9vw",
                    color: 'rgb(107, 154, 255)',
                    padding: '3px',
                    borderRadius: '5px'
                  }}
                >
                  {Component.name(Elem.id(seleElement)!)}
                </div>
              )}

              {/* rotate feature */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  style={{
                    position: "absolute",
                    top: Unit.px(Style.top(seleElement) - 20),
                    left: Unit.px(
                      Style.left(seleElement) + Style.width(seleElement) / 2
                    ),
                    width: "6px",
                    height: "6px",
                    background: "rgb(107, 154, 255)",
                    zIndex: 30,
                    cursor: "crosshair",
                    borderRadius: "50px",
                  }}
                  onMouseDown={() => {
                    set_whatToResize("topleft-rotate");
                    set_startResizing(true);
                    set_elementBottomPosition({
                      x: 0,
                      y: Style.bottom(seleElement),
                    });
                  }}
                />
              )}

              {/* this is the top resize feature of element */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  id={TOP_RESIZE}
                  style={{
                    position: "absolute",
                    top: Unit.px(Style.top(seleElement) - 1),
                    left: Unit.px(Style.left(seleElement)),
                    width: Unit.px(Style.width(seleElement)),
                    height: "1px",
                    zIndex: 30,
                    background: 'transparent',
                    cursor: "ns-resize",
                    transform: 'scaleY(5)'
                  }}
                  onMouseDown={() => {
                    set_whatToResize("top");
                    set_startResizing(true);
                    set_elementBottomPosition({
                      x: 0,
                      y: Style.bottom(seleElement) + scrollTop,
                    });
                  }}
                ></div>
              )}

              {/* this is the right resize feature of element */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  id={RIGHT_RESIZE}
                  style={{
                    position: "absolute",
                    top: Unit.px(Style.top(seleElement)),
                    left: Unit.px(Style.right(seleElement)),
                    width: "1px",
                    height: Unit.px(Style.height(seleElement)),
                    zIndex: 30,
                    background: 'transparent',
                    cursor: "ew-resize",
                    transform: 'scaleX(5)'
                  }}
                  onMouseDown={() => {
                    set_whatToResize("right");
                    set_startResizing(true);
                    set_elementLeftPosition({
                      x: Style.left(seleElement) + scrollLeft,
                      y: 0,
                    });
                  }}
                ></div>
              )}

              {/* this is the bottom resize feature of element */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  id={BOTTOM_RESIZE}
                  style={{
                    position: "absolute",
                    top: Unit.px(Style.bottom(seleElement)),
                    left: Unit.px(Style.left(seleElement)),
                    width: Unit.px(Style.width(seleElement)),
                    height: "1px",
                    zIndex: 30,
                    background: 'transparent',
                    cursor: "ns-resize",
                    transform: 'scaleY(5)'
                  }}
                  onMouseDown={() => {
                    set_whatToResize("bottom");
                    set_startResizing(true);
                    set_elementTopPosition({ x: 0, y: Style.top(seleElement) + scrollTop });
                  }}
                ></div>
              )}

              {/* this is the left resize feature of element */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  id={LEFT_RESIZE}
                  style={{
                    position: "absolute",
                    top: Unit.px(Style.top(seleElement)),
                    left: Unit.px(Style.left(seleElement) - 1),
                    width: "1px",
                    height: Unit.px(Style.height(seleElement)),
                    zIndex: 30,
                    background: 'transparent',
                    cursor: "ew-resize",
                    transform: 'scaleX(5)'
                  }}
                  onMouseDown={() => {
                    set_whatToResize("left");
                    set_startResizing(true);
                    set_elementRightPosition({
                      x: Style.right(seleElement) + scrollLeft,
                      y: 0,
                    });
                  }}
                ></div>
              )}

              {/* top-left corner resize button */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  id="topleft-resize"
                  style={{
                    position: "absolute",
                    top: `calc(${Style.top(seleElement)}px - 0.25vw)`,
                    left: `calc(${Style.left(seleElement)}px - 0.25vw)`,
                    width: "0.5vw",
                    height: "0.5vw",
                    zIndex: 30,
                    background: 'white',
                    cursor: "nw-resize",
                    outline: '0.1vw solid rgb(107, 154, 255)',
                    borderRadius: '0.05vw'
                  }}
                  onMouseDown={() => {
                    set_whatToResize("top-left");
                    set_startResizing(true);
                    set_elementBottomPosition({
                      x: Style.right(seleElement) + scrollLeft,
                      y: Style.bottom(seleElement) + scrollTop,
                    });
                  }}
                ></div>
              )}

              {/* top-right corner resize button */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  id="topright-resize"
                  style={{
                    position: "absolute",
                    top: `calc(${Style.top(seleElement)}px - 0.25vw)`,
                    left: `calc(${Style.right(seleElement)}px - 0.25vw)`,
                    width: "0.5vw",
                    height: "0.5vw",
                    zIndex: 30,
                    background: 'white',
                    outline: '0.1vw solid rgb(107, 154, 255)',
                    cursor: "ne-resize",
                    borderRadius: '0.05vw'
                  }}
                  onMouseDown={() => {
                    set_whatToResize("top-right");
                    set_startResizing(true);
                    set_elementBottomPosition({ x: Style.left(seleElement) + scrollLeft, y: Style.bottom(seleElement) + scrollTop })
                  }}
                ></div>
              )}

              {/* bottom-right corner resize button */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  id="bottomright-resize"
                  style={{
                    position: "absolute",
                    top: `calc(${Style.bottom(seleElement)}px - 0.25vw)`,
                    left: `calc(${Style.right(seleElement)}px - 0.25vw)`,
                    width: "0.5vw",
                    height: "0.5vw",
                    zIndex: 30,
                    background: 'white',
                    outline: '0.1vw solid rgb(107, 154, 255)',
                    cursor: "nw-resize",
                    borderRadius: '0.05vw'
                  }}
                  onMouseDown={() => {
                    set_whatToResize("bottom-right");
                    set_startResizing(true);
                    set_elementTopPosition({ x: Style.left(seleElement) + scrollLeft, y: Style.top(seleElement) + scrollTop })
                  }}
                ></div>
              )}

              {/* bottom-left corner resize button */}
              {!startMovingObject && Elem.id(seleElement) && (
                <div
                  id="bottomleft-resize"
                  style={{
                    position: "absolute",
                    top: `calc(${Style.bottom(seleElement)}px - 0.25vw)`,
                    left: `calc(${Style.left(seleElement)}px - 0.25vw)`,
                    width: "0.5vw",
                    height: "0.5vw",
                    zIndex: 30,
                    background: 'white',
                    outline: '0.1vw solid rgb(107, 154, 255)',
                    cursor: "ne-resize",
                    borderRadius: '0.05vw'
                  }}
                  onMouseDown={() => {
                    set_whatToResize("bottom-left");
                    set_startResizing(true);
                    set_elementTopPosition({ x: Style.right(seleElement) + scrollLeft, y: Style.top(seleElement) + scrollTop })
                  }}
                ></div>
              )}


              {/* position indicators will be shown if element is inside the page */}

              {Elem.id(seleElement)!.parentElement!.id !== CANVAS && <>
                            {/* top position of the element indicator */}
                            <div
              style={{
                position: 'absolute',
                background: "rgb(107, 154, 255)",
                width: Unit.px(Style.width(seleElement)),
                top: Unit.px(Style.top(seleElement)),
                height: '0.1vw',
                left: Unit.px(Style.left(seleElement))
              }}
              />

              {/* left position of the element indicator */}
              <div
              style={{
                position: 'absolute',
                background: "rgb(107, 154, 255)",
                width: '0.1vw',
                top: Unit.px(Style.top(seleElement)),
                height: Unit.px(Style.height(seleElement)),
                left: Unit.px(Style.left(seleElement))
              }}
              />

              {/* bottom position of the element indicator */}
              <div
              style={{
                position: 'absolute',
                background: "rgb(107, 154, 255)",
                width: Unit.px(Style.width(seleElement)),
                top: Unit.px(Style.top(seleElement) + Style.height(seleElement) - 1),
                height: '0.1vw',
                left: Unit.px(Style.left(seleElement))
              }}
              />

              {/* right position of the element indicator */}
              <div
              style={{
                position: 'absolute',
                background: "rgb(107, 154, 255)",
                width: '0.1vw',
                top: Unit.px(Style.top(seleElement)),
                height: Unit.px(Style.height(seleElement)),
                left: Unit.px(Style.left(seleElement) + Style.width(seleElement))
              }}
              />

              </>}

            </div>
          )}



        

        {/* context menu */}
        {displayContext && Elem.id(seleElement) && (
          <div
            id="context-menu"
            style={{
              top: Unit.px(contextMenuPosition.y),
              left: Unit.px(contextMenuPosition.x),
              zIndex: 50000,
            }}
          >
            {logic.notInExceptions(seleElement, [CANVAS]) && (
              <p
                className="text-white bg-red"
                onClick={() => {
                  ED.rm(seleElement, CANVAS, set_seleElement);
                  ED.rmm(selectedElements, CANVAS, set_seleElement, set_selectedElements)
                  set_displayContext(false);
                }}
              >
                Delete <span className="text-white">del</span>
              </p>
            )}
            <p>
              Copy <span>ctr + c</span>
            </p>
            <p>
              Paste <span>ctr + v</span>
            </p>
            <p>
              Edit <span>ctr + e</span>
            </p>
            <p onClick={() => console.log(Elem.id(seleElement)?.innerHTML)}>
              HTML <span></span>
            </p>
            <p onClick={() => {
              set_displayRightMenu(!displayRightMenu)
              set_displayContext(false);
              }}>
              Page
            </p>
            <p>
              Prototype
            </p>
          </div>
        )}


            

      </div>

      {loading && <div id='loading'>
        <img
        alt={'Logo'}
        style={{
          width: '5vw'
        }}
        src="/logo.svg" />
        {/* <h1 style={{ marginBottom: '1vw'}}>Hammer</h1> */}
        <LinearProgress
        id='progress'
        style={{
          width: '10vw',
          height: '0.2vw',
          borderRadius: '1vw'
        }}
        />
        </div>}  
    </>
  );
}

export default App;
