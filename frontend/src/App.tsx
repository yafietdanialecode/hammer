/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyboardEvent, MouseEvent, WheelEvent, useEffect, useState } from 'react';
import './config.css'
import './App.css'
import Elem from './modules/Elem';
import Unit from './modules/unit';
import Scroll from './modules/scroll';
import Style from './modules/Style';
import { getCIArea } from './modules/getCIArea';
import Logic from './modules/Logic';
import Component from './modules/Component';
import { BOTTOM_RESIZE, CANVAS, DECORATORS, LEFT_RESIZE, LEFT_TOOLS, MAIN, MULTIPLE_ELMENTS_WRAPPER, RIGHT_RESIZE, STATES, TOP_RESIZE } from './id-storage/constants.config';

function App() {

  
  // indicates how much user scrolled
  const [scrollTop, set_scrollTop] = useState(0);
  const [scrollLeft, set_scrollLeft] = useState(0);

  // selection event verification 1
  const [selectionStarted, set_selectionStarted] = useState(false)
  // this is second confirmation for mouse selectionstarted
  const [selectionStarted2, set_selectionStarted2] = useState(false)
  // selectionType = text / elements
  const [selectionType, set_selectionType] = useState('');
  // starting horizontal and vertical position
  const [startSelectingFrom, set_startSelectingFrom] = useState({x: 0, y: 0});
  // tracks where the selection stopped
  const [includeSelectingUpto, set_includeSelectingUpto] = useState({x: 0, y: 0});
  // lists of selected elements in this cordinate
  const [selectedElements, set_selectedElements] = useState([]);
  // where the selected component comes
  const [fromWhereAreTheComponent, set_fromWhereAreTheComponent] = useState(CANVAS)

  // show all selected elements wrapper
  const [multiSelectedElementsWrapperDivStartFrom, set_multiSelectedElementsWrapperDivStartFrom] = useState({ x: 0, y: 0});
  const [multiSelectedElementsWrapperDivInclude, set_multiSelectedElementsWrapperDivInclude] = useState({ x: 0, y: 0});

  // seleElement
  const [seleElement, set_seleElement] = useState('');

  // cursor based
  const [cursorStyle, set_cursorStyle] = useState('default');

  // movement
  const [startMovingObject, set_startMovingObject] = useState(false);
  const [objectCursorDifference, set_objectCursorDifference] = useState({x: 0, y: 0})
  const [movingFrom, set_movingFrom] = useState(CANVAS);
  const [movingTo, set_movingTo] = useState(CANVAS);
 
  // editing features
  const [textEditingModeEnabled, set_textEditingModeEnabled] = useState(false);
  
  // context options
  const [displayContext, set_displayContext] = useState(false);
  const [contextMenuPosition, set_contextMenuPosition] = useState({ x: 0, y: 0})

  // mouse states
  const [mousePosition, set_mousePosition] = useState({
    x: 0,
    y: 0
  })

  // dev states
  const [displayDevStates, set_displayDevStates] = useState(false)
  
  /**
   * the states below are for tools on the element
   */
  const [startResizing, set_startResizing] = useState(false); // start and end of resizing
  const [ whatToResize, set_whatToResize] = useState('') // the type of resizing

  /**
   * those are states of resizing a component
   */
  const [elementLeftPosition, set_elementLeftPosition] = useState({ x: 0, y: 0 });
  const [elementRightPosition, set_elementRightPosition] = useState({ x: 0, y: 0 });
  const [elementTopPosition, set_elementTopPosition] = useState({ x: 0, y: 0 });
  const [elementBottomPosition, set_elementBottomPosition] = useState({ x: 0, y: 0 });


  /**
   * this is the hook that will start when 
   * the page loaded and rendered 
   * [ only once it opened ]
   */
  useEffect(() => {
    console.log("page initiated");
    Elem.id(CANVAS)!.scrollTo({
      behavior: 'instant',
      top: 10000,
      left: 10000
    })
  }, [])

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
  
  })

  // when mouse move in the whole window
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.addEventListener('mousemove', (e: any) => {

    // update mouse position every time 
    set_mousePosition({x: e.clientX, y: e.clientY});
    

    /**
     * when user selects in component mode 
     * this descides how inclusive the selected range or zone will be
     */
    if(selectionStarted && !startMovingObject){
      set_selectionStarted2(true);
      set_includeSelectingUpto({
      x: e.clientX + scrollLeft,
      y: e.clientY + scrollTop})
    }

    

  })

  window.onmouseup = (e: any) => {

    /**
     * after user mouse release there will be no resizing
     */

    set_startResizing(false);
    set_whatToResize('')

    /**
     * the code inside the next if statement is a feature for migrating 
     * a child of page to CANVAS or to page and a child of CANVAS to page
     */
    // when user releases the mouse
    if(movingFrom !== movingTo && startMovingObject) {
      // moving single component features below
      // if you need multipe next to this block
      const parent = Elem.id(seleElement)!.parentElement!.id

      
      if(seleElement && selectedElements.length < 2 && seleElement !== MULTIPLE_ELMENTS_WRAPPER){
       /* moving single component from CANVAS > page
      */ 
        if(movingFrom == CANVAS && movingTo != CANVAS && Elem.id(seleElement)!.getAttribute('data-type') !== 'page'){
        const clone: any = Elem.id(seleElement)!.cloneNode(true);
        clone.style.top = Unit.px(Style.top(seleElement) - Style.top(movingTo));
        clone.style.left = Unit.px(Style.left(seleElement) - Style.left(movingTo));
        Elem.id(seleElement)?.remove();
        Elem.id(movingTo)?.append(clone);
      }
      // moving single component from page > canvas
      if(movingFrom !== CANVAS && movingTo == CANVAS && Elem.id(seleElement)!.getAttribute('data-type') !== 'page'){
        const clone: any = Elem.id(seleElement)!.cloneNode(true);
        
        clone.style.top = Unit.px((mousePosition.y + scrollTop) - (objectCursorDifference.y - Style.top(parent)) + scrollTop);
        clone.style.left = Unit.px((mousePosition.x + scrollLeft) - (objectCursorDifference.x - Style.left(parent)) + scrollLeft);
        Elem.id(seleElement)?.remove();
        Elem.id(CANVAS)?.append(clone);
        
      }
      // moving single component from page > page
      if(movingFrom !== CANVAS
       &&
        movingTo !== CANVAS
       && 
        Elem.id(seleElement)!.getAttribute('data-type') !== 'page'
       &&
        Elem.id(movingFrom)!.getAttribute('data-type') == 'page'
        &&
        Elem.id(movingTo)!.getAttribute('data-type') == 'page'
      ){
        const clone:any = Elem.id(seleElement)!.cloneNode(true);

        clone.style.top = Unit.px((e.clientY - (objectCursorDifference.y - Style.top(Elem.id(seleElement)!.parentElement!.id)) - Style.top(movingTo)) + scrollTop);
        clone.style.left = Unit.px((e.clientX - (objectCursorDifference.x - Style.left(Elem.id(seleElement)!.parentElement!.id))) - Style.left(movingTo) + scrollLeft);

        Elem.id(seleElement)?.remove();
        Elem.id(movingTo)?.append(clone);
      }
      }
    }

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
    if(selectedElements.length > 1 && !startMovingObject){
      // wrapper
      const wrapper = Elem.id(MULTIPLE_ELMENTS_WRAPPER)!
      /**
       * for each selected elements we will edit and append them to wrapper
       */
      selectedElements.map((each: string) => {
        /**
         * we clone them b/c they will be removed from the previous position temporarly
         */
        const copy: any = Elem.id(each)!.cloneNode(true);

        /**
         * top and left position of the wrapper and CANVAS is different
         * that's why we update the elements position and append the new 
         * one to the wrapper
         */
        copy.style.top = Unit.px((Style.top(each) - multiSelectedElementsWrapperDivStartFrom.y) + scrollTop);
        copy.style.left = Unit.px((Style.left(each) - multiSelectedElementsWrapperDivStartFrom.x) + scrollLeft);
        Elem.id(each)?.remove()
        wrapper.append(copy)

      })
    }
    
  }

  /**
   * browsers default context menu options are not permitted
   * because we need more custom workflows and if we don't prevent
   * them they might crush the application in some cases
   */
  window.oncontextmenu = (e: any) => {
    e.preventDefault();
    set_displayContext(true)
    set_contextMenuPosition({
      x: e.clientX,
      y: e.clientY
    })
  }

  // this is the logic class
  const logic = new Logic('root', { CANAS_ID: CANVAS })


  return (
    <>
      <div id={MAIN}
      tabIndex={-1}
      style={{
        cursor: cursorStyle
      }}
      >

      {/* bottom mode changes */}
      <div id={LEFT_TOOLS}>
        <div 
        style={{
          background: 'white',
          position: 'fixed',
          top: '12vh',
          left: '1vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '3vw',
          borderRadius: '5px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          // rowGap: '0.5vw',
          borderBottom: '1px solid gray',
          paddingBottom: '0.5vw',
          
        }}
        >
          <button title='Select'><i className="bi bi-cursor"></i></button>
          <button title='Move'><i className="bi bi-arrows-move"></i></button>
        </div>
        <button title="text"><i className="bi bi-fonts"></i></button>
        <button title='image'><i className="bi bi-images"></i></button>
        <button title='page'><i className="bi bi-phone"></i></button>
        <button title='button'><i className="bi bi-menu-button-wide-fill"></i></button>
        <button title='input'><i className="bi bi-input-cursor"></i></button>
      </div>

      {/* upper tools */}
      {/* 
        * currently it holds the logo
       */}
      <div id="upper-tools">
        <div id="logo"/>
        <button onClick={() => set_textEditingModeEnabled(!textEditingModeEnabled)}>Text Edit Mode</button>
        <button onClick={() => set_displayDevStates(!displayDevStates)}>states</button>
        <button onClick={() => Elem.id(CANVAS)!.scrollTo({ top: Style.top('center'), left: Style.left('center')})}>center</button>
      </div>

      {/* CANVAS */}
      <div id={CANVAS}
      
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
        // some variables
        const id: string = e.target.id;

        // some checks
        const isCanvas: boolean = e.target.id === CANVAS ? true : false;
        // let isItsParentCanvas = Elem.id(id)!.parentElement!.id === CANVAS ? true : false;
        /**
         * registor where the selected elements from
         * [ simply the parent of the element by the time they toched by pointer ]
         */
        if(!isCanvas){
        // if this element is not CANVAS
        set_movingFrom(Elem.id(id)!.parentElement!.id)
        set_movingTo(Elem.id(id)!.parentElement!.id)
        }
        set_fromWhereAreTheComponent(Elem.id(e.target.id)!.parentElement!.id);

        /**
         * the code below must be cleaners
         * cleaners are codes who reset opened things if we user needs to close them easily
         * simpliy they reset states
         */
        set_displayContext(false)

        /*
        * this is after user selects and do his thing 
        * and he needs to stop selection
        * we identify that by
        *   1. if there are selected elements
        *   2. if selected element is not the wrapper (the selection box)
        *   3. if user doesn't user shiftKey ( because he might be making an elemnt part of selection or removing element from selected ones)
        * 
        */
        if(selectedElements.length > 1 && e.target.id !== MULTIPLE_ELMENTS_WRAPPER && !e.shiftKey){
          // if user selects something before append those to the real dom

          /**
           * this makes a clone of elemnts in wrapper and 
           * append them to there original place like (CANVAS & page)
           * 
           */
        selectedElements.map((each: string) => {
          const copy: any = Elem.id(each)!.cloneNode(true);
          copy.style.top = Unit.px(Style.top(each) + scrollTop);
          copy.style.left = Unit.px(Style.left(each) + scrollLeft);
          set_selectedElements([])
          Elem.id(each)?.remove();
          Elem.id(CANVAS)!.append(copy);
        })
        }

        /**
         * this is the component who register the element selected if the elemnt is not the exception
         * select is the blue box who follows you when you are selecting the elements in the ui 
        */
      if(
        e.target.id !== 'select'
        ){
        set_seleElement(e.target.id);
      }
      
      /**
       * this is for moving object feature
       * this helps to find the difference with cursor and moving object
       * this value is the one who helped as to move the element with respect to referencing point in it 
       */
      if(e.target.id !== CANVAS){ // this if statement will be replaced by modes // modes like text, move, select ...
        if(Elem.id(e.target.id)!.parentElement!.id == CANVAS){
          // this is for moving pages, components and anything inside CANVAS but not page
          const l: number = Style.left(e.target.id);
          const t: number = Style.top(e.target.id);
          set_objectCursorDifference({
          x: (e.clientX + scrollLeft) - (l + scrollLeft),
          y: (e.clientY + scrollTop) - (t + scrollTop)
        })
        }else {
          // this is for moving components only inside a page not inside CANVAS 
        const l: number = Style.left(e.target.id) - Style.left(Elem.id(e.target.id)!.parentElement!.id);
        const t: number = Style.top(e.target.id) - Style.top(Elem.id(e.target.id)!.parentElement!.id);
        set_objectCursorDifference({
          x: ((e.clientX + scrollLeft) - (l)),
          y: (e.clientY + scrollTop) - (t)
        })
        }
        set_startMovingObject(true)
        set_cursorStyle('grabbing')
      }

      /**
       * this is all about selecting element feature
       * this works if you put pointer in the CANVAS
       */
      if(e.target.id === CANVAS){

        // if CANVAS is working
        set_movingFrom(CANVAS);
        set_movingTo(CANVAS);

          /**
           * selection type is important for future features
           * because we need to separate text editing selection and component selection 
           * this prevents crush when users need to edit text and when they select the text
           */
          set_selectionType('components');
          /**
           * set_startSelectingFrom
           * identifyes where user needs to start selecting from 
           */
          set_startSelectingFrom({
            x: e.clientX + scrollLeft,
            y: e.clientY + scrollTop
          })
          
          /**
           * set_includeSelectingUpto
           * identifies how far selecting includes
           * or the end of selectiion
           */
          set_includeSelectingUpto({
            x: e.clientX + scrollLeft,
            y: e.clientY + scrollTop
          })
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
           * user's action tells us he needs to ungroup those components
           */
          set_selectedElements([]);

        }

      }}


      onMouseMove={(e: MouseEvent) => {

      /**
       * resizing features
       */

      if(startResizing) {
        /**
         * this is the action taker for each type ( specifically 8 types of resizes )
         * this takes:
         *  1. whether resize starts
         *  2. which type of resize is occuring
         *  3. which point
         */

        // top resize
        if(whatToResize == 'top'){
          // if this is an elment inside a CANVAS
          if(Elem.id(seleElement)!.parentElement!.id == CANVAS)
          {
          Elem.id(seleElement)!.style.top = Unit.px(e.clientY + scrollTop);
          Elem.id(seleElement)!.style.height = Unit.px(elementBottomPosition.y - (e.clientY))
          }else 
          // if this is an elment inside a page
          if(Elem.id(seleElement)!.parentElement!.getAttribute('data-type') == 'page')
          {
          const parent = Elem.id(seleElement)!.parentElement!.id;
          Elem.id(seleElement)!.style.top = Unit.px(e.clientY - Style.top(parent));
          Elem.id(seleElement)!.style.height = Unit.px((elementBottomPosition.y - Style.top(parent))- (e.clientY - Style.top(parent)))
          }
        }else if(whatToResize == 'right'){
          // if this is an elment inside a CANVAS
          if(Elem.id(seleElement)!.parentElement!.id == CANVAS)
          {
          Elem.id(seleElement)!.style.left = Unit.px(elementLeftPosition.x + scrollLeft);
          Elem.id(seleElement)!.style.width = Unit.px(e.clientX - (elementLeftPosition.x))
          }else 
          // if this is an elment inside a page
          if(Elem.id(seleElement)!.parentElement!.getAttribute('data-type') == 'page')
          {
          const parent = Elem.id(seleElement)!.parentElement!.id;
          Elem.id(seleElement)!.style.left = Unit.px(elementLeftPosition.x - Style.left(parent));
          Elem.id(seleElement)!.style.width = Unit.px((e.clientX) - elementLeftPosition.x)
          }        
        }else if(whatToResize == 'bottom'){
            // if this is an elment inside a CANVAS
            if(Elem.id(seleElement)!.parentElement!.id == CANVAS)
            {
            Elem.id(seleElement)!.style.top = Unit.px(elementTopPosition.y + scrollTop);
            Elem.id(seleElement)!.style.height = Unit.px(e.clientY - elementTopPosition.y)
            }else 
            // if this is an elment inside a page
            if(Elem.id(seleElement)!.parentElement!.getAttribute('data-type') == 'page')
            {
            const parent = Elem.id(seleElement)!.parentElement!.id;
            Elem.id(seleElement)!.style.top = Unit.px(elementTopPosition.y - Style.top(parent));
            Elem.id(seleElement)!.style.height = Unit.px((e.clientY) - elementTopPosition.y)
            }        
          }else if(whatToResize == 'left'){
            // if this is an elment inside a CANVAS
            if(Elem.id(seleElement)!.parentElement!.id == CANVAS)
            {
            Elem.id(seleElement)!.style.left = Unit.px(e.clientX + scrollLeft);
            Elem.id(seleElement)!.style.width = Unit.px(elementRightPosition.x - e.clientX)
            }else 
            // if this is an elment inside a page
            if(Elem.id(seleElement)!.parentElement!.getAttribute('data-type') == 'page')
            {
            const parent = Elem.id(seleElement)!.parentElement!.id;
            Elem.id(seleElement)!.style.left = Unit.px(e.clientX - Style.left(parent));
            Elem.id(seleElement)!.style.width = Unit.px(elementRightPosition.x - e.clientX)
            }        
          }
      }

      /**
       * this is the code who set's selected component position
       * both top and left
       */
      if(startMovingObject){
        if(Elem.id(seleElement)!.parentElement!.id === CANVAS) {
          Elem.id(seleElement)!.style.top = Unit.px((e.clientY + scrollTop) - objectCursorDifference.y);
          Elem.id(seleElement)!.style.left = Unit.px((e.clientX + scrollLeft) - objectCursorDifference.x);
        }
        else if(Elem.id(seleElement)!.parentElement?.getAttribute('data-type') === 'page') {
          Elem.id(seleElement)!.style.top = Unit.px((e.clientY - scrollTop) - objectCursorDifference.y);
          Elem.id(seleElement)!.style.left = Unit.px((e.clientX - scrollLeft) - objectCursorDifference.x);
        }
        // this is where elements get appended inside and page and get out from page
        if(seleElement.length > 0 || selectedElements.length > 1){

          const all: any = Elem.id('main')!.querySelectorAll('*');
          const results: string[] = [];
          const x_start = e.clientX + scrollLeft;
          const y_start = e.clientY + scrollTop;
          
          all.forEach((element: any) => {
            if(
              Style.top(element.id) + scrollTop < y_start && 
              Style.left(element.id) + scrollLeft < x_start &&
              Style.right(element.id) + scrollLeft > x_start &&
              Style.bottom(element.id) + scrollTop > y_start &&
              (element.id === CANVAS || element.getAttribute('data-type') === 'page')
              ) {
                results.push(element.id)
            }
          })

          if(results.length == 1){
            set_movingTo(results[0]);
          }else {
            set_movingTo(results[1])
          }
          
        }

      }

      /**
       * if selection of elements verifyed by two verifications
       * know this code will do:
       *    - identify which elemnts could be selected and regester them
       *    - and tells the wrapper (for moving elemnts ) the information like
       *      what is it's position and size
       */
      if(selectionStarted && selectionStarted2){
      
        const res = getCIArea(startSelectingFrom, includeSelectingUpto)
        set_selectedElements(res);
        
        // create a wrapper elemnt
        if(res.length == 1){
          // this means user selected one element only
          set_seleElement(res[0]);
        }else if(res.length > 1){
          // this means user selected multiple elements only
          
          const startFromMax = { x: 20000, y: 2000000 };
          const includeUpToMax = { x: -20000, y: -200000 };
          
          
          res.forEach((each: string) => {
            
            // some varialble to clean the code
            const eTop: number = Style.top(each);
            const eLeft: number = Style.left(each);
            const eRight: number = Style.right(each);
            const eBottom: number = Style.bottom(each);
            
            if(eTop < startFromMax.y){ // the top minimum value of element
              startFromMax.y = eTop;
              console.log('top: ' + eTop);
            }
            if(eLeft < startFromMax.x){ // the left minimum value of element
              startFromMax.x = eLeft;
              console.log('left: ' + eLeft)
            }
            if(eRight > includeUpToMax.x){ // the right maximum value of element
              includeUpToMax.x = eRight;
              console.log('right ' + eRight);
            }
            if(eBottom > includeUpToMax.y){ // the bottom maximum value of element
              includeUpToMax.y = eBottom;
              console.log('bottom: ' + eBottom); 
            }
            
          })
          startFromMax.x += scrollLeft;
          startFromMax.y += scrollTop
          includeUpToMax.x += scrollLeft;
          includeUpToMax.y += scrollTop; 
          set_multiSelectedElementsWrapperDivStartFrom(startFromMax);
          set_multiSelectedElementsWrapperDivInclude(includeUpToMax)
          set_seleElement(MULTIPLE_ELMENTS_WRAPPER);
        }

      }


      /**
       * if user is moving elements only not pages
       * we will actually move components inside the wrapper
       * wrapper in this code means the elements parent
       * if user's mouse starts grabbing the element from the out side (CANVAS)
       *        - when user enters pages we have to move the elment inside the page
       *
       * if user's mosue starts grabbing the elemtn from the inside (pages)
       *        - when user move the component to the outside (CANVAS) move the elemnent to outside
       */

        if(startMovingObject || (selectionStarted2 && selectionStarted) || startResizing){
          
          // for go up
          if(mousePosition.y < 100){
            Elem.id(CANVAS)?.scrollBy({ behavior: 'instant', top: -10, left: 0})
          }
          // for go down
          if(mousePosition.y > window.innerHeight - 50){            
            Elem.id(CANVAS)?.scrollBy({ behavior: 'instant', top: 10, left: 0})
          }

          // for go up
          if(mousePosition.x < 100){
            Elem.id(CANVAS)?.scrollBy({ behavior: 'instant', top: 0, left: -10})
          }
          // for go down
          if(mousePosition.x > window.innerWidth - 50){            
            Elem.id(CANVAS)?.scrollBy({ behavior: 'instant', top: 0, left: 10})
          }

          if(startMovingObject){
            Elem.id(seleElement)!.style.top = Unit.px((mousePosition.y + scrollTop) - objectCursorDifference.y);
            Elem.id(seleElement)!.style.left = Unit.px((mousePosition.x + scrollLeft) - objectCursorDifference.x);
          }
          

        }
      }}


      onWheel={(e: WheelEvent) => {

          // updating user's scroll amount 
          set_scrollTop(Scroll.top(CANVAS)!);
          set_scrollLeft(Scroll.left(CANVAS)!);

          Elem.id(CANVAS)!.scrollBy({
            behavior: 'instant',
            top: e.movementY,
            left: e.movementX
          })

          console.table({
            behavior: 'instant',
            top: e.movementY,
            left: e.movementX
          })
          
      }}
      
      
      onKeyDown={(e: KeyboardEvent) => {

        /**
         * WARNING:
         * remember if every thing is stable
         * make those functionalities dependent on not user's text editing event 
         * is enabled
         * [ simply : if user's editText state enabled those should not work]
         */

        // all key events actions related to CANVAS element are hear


        // those features work or not work based on users state
        if(!textEditingModeEnabled){

          /**
           * those are keys will not work as default if users are not editing text
           */
          const DIRECTION_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
          if(DIRECTION_KEYS.some((key: string) => key == e.key)){
            e.preventDefault();
            const top_e = parseFloat(Elem.id(seleElement)!.style.top);
            const left_e = parseFloat(Elem.id(seleElement)!.style.left);
            switch(e.key){
              case 'ArrowUp':
                Elem.id(seleElement)!.style.top = Unit.px(top_e - 1);
              break;
              case 'ArrowDown':
                Elem.id(seleElement)!.style.top = Unit.px(top_e + 1);
              break;
              case 'ArrowLeft':
                Elem.id(seleElement)!.style.left = Unit.px(left_e - 1);
              break;
              case 'ArrowRight':
                Elem.id(seleElement)!.style.left = Unit.px(left_e + 1);
              break;
              
            }
          }
          /**
           * those are keys which work if user is not editing text
           */

          /**
         * to delete elemnt by pressing del key in laptop
         */
        if(e.key == 'Delete'){
          selectedElements.map((each: string) => {
            if(Elem.id(each) && each.length > 0 && logic.CANVA_ELEMENT_EXCEPTION.every((id: string) => id !== each)){
              Elem.id(each)?.remove()
            }
          });
          set_seleElement(CANVAS);
          set_selectedElements([]);
          set_selectionStarted2(false);
          set_selectedElements([]);
        }else
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
         * move the elemnt forward
         */
        if(e.key == ']'){
          Elem.id(seleElement)!.style.zIndex = `${Style.zIndex(seleElement) + 1}` 
        }
        /**
         * move the elment backward
         */
        if(e.key == '['){
          Elem.id(seleElement)!.style.zIndex = `${Style.zIndex(seleElement) - 1}` 
        }
        }

  
      }}
      >
        {/* this makes the scrolling feature possible */}
        <div

        style={{
          position: 'absolute',
          top: Unit.px(window.innerHeight + scrollTop + 200000),
          left: Unit.px(window.innerWidth + scrollLeft + 200000),
          width: '10px',
          height: '10px',
          background: 'transparent',
          pointerEvents: 'none'
        }}
        ></div>

        <button id='btn'
        style={{
          position: 'absolute',
          top: '10100px',
          left: '10100px',
          padding: '10px 20px',
          zIndex: 3,
          width: '150px',
          background: 'black',
          color: 'white'
        }}
        >Click Here</button>
        <h1
        id='title-1'
        style={{ width: '250px', position: 'absolute', 
        top: '10100px',
        left: '10100px',
        background: 'none', fontSize: '32px', zIndex: 2}}>I'm The Title Sir</h1>

        <div id="page-0" data-type='page'
        style={{
          width: "480px",
          height: '800px',
          top: '10100px',
          left: '10100px',
          background: 'white',
          position: 'absolute',
          zIndex: 0
        }}
        >
          <img id='img-01'
          draggable="false"
          style={{ zIndex: 2, position: 'absolute', top: '0px', left: '0px', width: '200px'}}
          src="/cat.jpg" alt="the image" />
          <img
          style={{ zIndex: 3, position: 'absolute', top: '0px', left: '0px', width: '200px'}}
          draggable="false"
          src="/mobile (1).gif" alt="logo" id="img-02" />
        
        </div>


<div id="page-1" data-type='page'
        style={{
          width: "480px",
          height: '800px',
          top: '10100px',
          left: '10600px',
          background: 'white',
          position: 'absolute',
          zIndex: 0
        }}
        >
      <h1
      style={{
        fontSize: '42px',
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '300px',
        zIndex: 0
      }}
      id='titie-inside-page'>Hello I'm Page</h1>
                <img id='img-03'
          draggable="false"
          style={{ zIndex: 2, position: 'absolute', top: '0px', left: '0px', width: '200px'}}
          src="/logo.svg" alt="the image" />
          <img
          style={{ zIndex: 3, position: 'absolute', top: '0px', left: '0px', width: '200px'}}
          draggable="false"
          src="/add-button.png" alt="logo" id="img-04" />

        </div>

        {/* dev components*/}
      {(selectionStarted && selectionStarted2 && selectionType == 'components')
        &&
        <div id="select"
        style={{
          position: 'absolute',
          top: includeSelectingUpto.y > startSelectingFrom.y ? Unit.px(startSelectingFrom.y) : Unit.px(includeSelectingUpto.y),
          left: includeSelectingUpto.x > startSelectingFrom.x ? Unit.px(startSelectingFrom.x) : Unit.px(includeSelectingUpto.x),
          width: includeSelectingUpto.x > startSelectingFrom.x ? Unit.px(includeSelectingUpto.x - startSelectingFrom.x) : Unit.px(startSelectingFrom.x - includeSelectingUpto.x),
          height: includeSelectingUpto.y > startSelectingFrom.y ? Unit.px(includeSelectingUpto.y - startSelectingFrom.y) : Unit.px(startSelectingFrom.y - includeSelectingUpto.y),
        }}
        ></div>
      }

      {selectedElements.length > 1 && <div id={MULTIPLE_ELMENTS_WRAPPER}
        style={{
          position: 'absolute',
          top: Unit.px(multiSelectedElementsWrapperDivStartFrom.y),
          left: Unit.px(multiSelectedElementsWrapperDivStartFrom.x),
          width: Unit.px(multiSelectedElementsWrapperDivInclude.x - multiSelectedElementsWrapperDivStartFrom.x),
          height: Unit.px(multiSelectedElementsWrapperDivInclude.y - multiSelectedElementsWrapperDivStartFrom.y),
          zIndex: 50000
        }}
        >
          
        </div>}
      </div>


      
      {/* 
      states are a key value pairs of useState hooks list 
      those display the value in real time
      */}
      {/* root states */}
      {displayDevStates && <table id={STATES}>
        <tbody>
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
          <td>{selectionStarted ? '🟢': '🔴'}</td>
        </tr>

        <tr>
          <td>selectionStarted2</td>
          <td>{selectionStarted2 ? '🟢' : '🔴'}</td>
        </tr>

        <tr>
          <td>selectionType</td>
          <td>{selectionType}</td>
        </tr>

        <tr>
          <td>startSelectingFrom</td>
          <td>
          X:{startSelectingFrom.x} <br />
          Y:{startSelectingFrom.y}</td>
        </tr>

        <tr>
          <td>includesSeletingUpto</td>
          <td>
            X:{includeSelectingUpto.x} <br />
            Y:{includeSelectingUpto.y}
          </td>
        </tr>

        <tr>
          <td>selectedElements</td>
          <td>{selectedElements.map((each: string) => <p key={each}>{each}</p>)}</td>
        </tr>

        <tr>
          <td>multiSelectedElementsWrapperDivStartFrom</td>
          <td>
            X:{multiSelectedElementsWrapperDivStartFrom.x} <br/>
            Y: {multiSelectedElementsWrapperDivStartFrom.y}
          </td>
        </tr>

        <tr>
          <td>multiSelectedElementsWrapperDivInclude</td>
          <td>
            X:{multiSelectedElementsWrapperDivInclude.x} <br/>
            Y: {multiSelectedElementsWrapperDivInclude.y}
          </td>
        </tr>

        <tr>
          <td>startResizing</td>
          <td>{startResizing ? '🟢' : '🔴'}</td>
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
          <td>{startMovingObject ? '🟢' : '🔴'}</td>
        </tr>

        <tr>
          <td>objectCursorDifference</td>
          <td>
            X: {objectCursorDifference.x} <br/>
            Y: {objectCursorDifference.y}
          </td>
        </tr>

        <tr>
          <td>textEditingModeEnabled</td>
          <td>{textEditingModeEnabled ? '🟢' : '🔴'}</td>
        </tr>

        <tr>
          <td>displayContext</td>
          <td>{displayContext ? '🟢' : '🔴'}</td>
        </tr>

        <tr>
          <td>contextMenuPosition</td>
          <td>
            X: {contextMenuPosition.x} <br/>
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

        </tbody>
      </table>}

        {displayDevStates && <table id="states" style={{ right: '350px', height: 'fit-content'}}>
          <caption>Element State</caption>
          <tbody>
          <tr>
            <th>name</th><th>value</th>
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
            <td>l: {Style.left(seleElement)! + scrollLeft}<br/>t: {Style.top(seleElement)! + scrollTop}<br/>r: {Style.right(seleElement)!}<br/>b: {Style.bottom(seleElement)}</td>
          </tr>
          <tr>
            <td>zIndex</td>
            <td>{Style.zIndex(seleElement)}</td>
          </tr>

          </tbody>
        </table>}

      {/* those are element feature previewers and decorators */}
      {(document.getElementById(seleElement) && seleElement !== CANVAS) && <div id={DECORATORS}>
        
      {/* element descriptor */}
      {(!startMovingObject && Elem.id(seleElement)) && <div 
      style={{
        position: 'absolute',
        top: Unit.px(Style.top(seleElement) - 15),
        left: Unit.px(Style.left(seleElement)),
        width: '6px',
        height: '6px',
        zIndex: 30,
        borderRadius: '50px',
        background: 'transparent',
        color: 'rgb(107, 154, 255)',
        fontSize: '12px'
    }}
      >{Component.name(seleElement)}</div>}


      {/* rotate feature */}
      {(!startMovingObject && Elem.id(seleElement)) &&<div 
      style={{
        position: 'absolute',
        top: Unit.px(Style.top(seleElement) - 20),
        left: Unit.px(Style.left(seleElement) + (Style.width(seleElement) / 2)),
        width: '6px',
        height: '6px',
        background: 'rgb(107, 154, 255)',
        zIndex: 30,
        cursor: 'crosshair',
        borderRadius: '50px',
    }}
      />}

        {/* this is the top resize feature of element */}
        {(!startMovingObject && Elem.id(seleElement)) && <div id={TOP_RESIZE}
        style={{
          position: 'absolute',
          top: Unit.px(Style.top(seleElement) - 1),
          left: Unit.px(Style.left(seleElement)),
          width: Unit.px(Style.width(seleElement)),
          height: '1px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ns-resize'
        }}
        onMouseDown={() => {
          set_whatToResize('top');
          set_startResizing(true);
          set_elementBottomPosition({ x: 0, y: Style.bottom(seleElement)});
        }}
        ></div>}

    {/* this is the right resize feature of element */}
            {(!startMovingObject && Elem.id(seleElement)) && <div id={RIGHT_RESIZE}
            style={{ 
              position: 'absolute',
              top: Unit.px(Style.top(seleElement)),
              left: Unit.px(Style.right(seleElement)),
              width: '1px',
              height: Unit.px(Style.height(seleElement)),
              zIndex: 30,
              background: 'rgb(107, 154, 255)',
              cursor: 'ew-resize'
            }}

            onMouseDown={() => {
              set_whatToResize('right');
              set_startResizing(true);
              set_elementLeftPosition({ x: Style.left(seleElement), y: 0});
            }}
            
            ></div>}
            
            
        {/* this is the bottom resize feature of element */}
        {(!startMovingObject && Elem.id(seleElement)) && <div id={BOTTOM_RESIZE}
        style={{ 
          position: 'absolute',
          top: Unit.px(Style.bottom(seleElement)),
          left: Unit.px(Style.left(seleElement)),
          width: Unit.px(Style.width(seleElement)),
          height: '1px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ns-resize'
        }}

        onMouseDown={() => {
          set_whatToResize('bottom');
          set_startResizing(true);
          set_elementTopPosition({ x: 0, y: Style.top(seleElement)});
        }}

        ></div>}

      {/* this is the left resize feature of element */}
        {(!startMovingObject && Elem.id(seleElement)) && <div id={LEFT_RESIZE}
        style={{ 
          position: 'absolute',
          top: Unit.px(Style.top(seleElement)),
          left: Unit.px(Style.left(seleElement) - 1),
          width: '1px',
          height: Unit.px(Style.height(seleElement)),
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ew-resize'
        }}

        onMouseDown={() => {
          set_whatToResize('left');
          set_startResizing(true);
          set_elementRightPosition({ x: Style.right(seleElement), y: 0})
        }}

        ></div>}

        {/* top-left corner resize button */}
        {(!startMovingObject && Elem.id(seleElement)) && <div id="topleft-resize"
        style={{
          position: 'absolute',
          top: Unit.px(Style.top(seleElement) - 3),
          left: Unit.px(Style.left(seleElement) - 3),
          width: '6px',
          height: '6px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'nw-resize'
        }}

        onMouseDown={() => {
          set_whatToResize('top-left');
          set_startResizing(true);
        }}
        
        ></div>}

        {/* top-right corner resize button */}
        {(!startMovingObject && Elem.id(seleElement)) && <div id="topright-resize"
        style={{
          position: 'absolute',
          top: Unit.px(Style.top(seleElement) - 3),
          left: Unit.px(Style.right(seleElement) - 3),
          width: '6px',
          height: '6px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ne-resize'
        }}

        onMouseDown={() => {
          set_whatToResize('top-right');
          set_startResizing(true);
        }}
        
        ></div>}

       {/* bottom-right corner resize button */}
        {(!startMovingObject && Elem.id(seleElement)) && <div id="bottomright-resize"
        style={{
          position: 'absolute',
          top: Unit.px(Style.bottom(seleElement) - 3),
          left: Unit.px(Style.right(seleElement) - 3),
          width: '6px',
          height: '6px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'nw-resize'
        }}

        onMouseDown={() => {
          set_whatToResize('bottom-right');
          set_startResizing(true);
        }}

        ></div>}

        {/* bottom-left corner resize button */}
        {(!startMovingObject && Elem.id(seleElement)) && <div id="bottomleft-resize"
        style={{
          position: 'absolute',
          top: Unit.px(Style.bottom(seleElement) - 3),
          left: Unit.px(Style.left(seleElement) - 3),
          width: '6px',
          height: '6px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ne-resize'
        }}

        onMouseDown={() => {
          set_whatToResize('bottom-left');
          set_startResizing(true);
        }}

        ></div>}

      </div>}



      {/* context menu */}
      {(displayContext && Elem.id(seleElement)) && <div id='context-menu'
      style={{
        top: Unit.px(contextMenuPosition.y),
        left: Unit.px(contextMenuPosition.x),
        zIndex: 50000
      }}
      >
        {logic.notInExceptions(seleElement, [ CANVAS ]) && <p
        className='text-white bg-red'
        onClick={() => {
          const exception:boolean = logic.CANVA_ELEMENT_EXCEPTION.every((each: string) => each !== seleElement);
          if(exception){
            // for single elment deleting
            if(selectedElements.length < 2){
            Elem.id(seleElement)?.remove()
            }else 
            // for multiple element delete
            if(seleElement == MULTIPLE_ELMENTS_WRAPPER) {
              set_selectedElements([]);
              set_selectionStarted(false);
              set_selectionStarted2(false);
            }
          }

          
          set_displayContext(false)
        }}
        >Delete <span className='text-white'>del</span></p>}
        <p>Copy <span>ctr + c</span></p>
        <p>Paste <span>ctr + v</span></p>
        <p>Edit <span>ctr + e</span></p>
        <p
        onClick={() => console.log(Elem.id(seleElement)?.innerHTML)
        }
        >HTML <span></span></p>
      </div>}
      
      </div>
    </>
  )
}

export default App
