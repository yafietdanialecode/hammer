import { useEffect, useState } from 'react'
import './App.css'
import gEBID from './modules/gEBID';
import { bottom, height, left, right, top, width } from './modules/getStyle';
import { px } from './modules/unit';
import { gScrLeft, gScrlTop } from './modules/scroll';
import { getCIArea } from './modules/getCIArea';
import Logic from './modules/Logic';
import componentName from './modules/componentName';

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
  const [selectedElements, set_selectedElements]: any = useState([]);
  // where the selected component comes
  const [fromWhereAreTheComponent, set_fromWhereAreTheComponent] = useState('canvas')

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
  const [movingFrom, set_movingFrom] = useState('canvas');
  const [movingTo, set_movingTo] = useState('canvas');
 
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
   * this is the hook that will start when 
   * the page loaded and rendered 
   * [ only once it opened ]
   */
  useEffect(() => {
    console.log("page initiated");
    gEBID('canvas')!.scrollTo({
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
  useEffect(() => {
    // updating user's scroll amount 
    set_scrollTop(gScrlTop('canvas')!);
    set_scrollLeft(gScrLeft('canvas')!);   

  })

  // when mouse move in the whole window
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
     * the code inside the next if statement is a feature for migrating 
     * a child of page to canvas or to page and a child of canvas to page
     */
    // when user releases the mouse
    if(movingFrom !== movingTo && startMovingObject) {
      // moving single component features below
      // if you need multipe next to this block
      let parent = gEBID(seleElement)!.parentElement!.id

      
      if(seleElement && selectedElements.length < 2 && seleElement !== 'selected-elements-wrapper'){
       /* moving single component from canvas > page
      */ 
        if(movingFrom == 'canvas' && movingTo != 'canvas' && gEBID(seleElement)!.getAttribute('data-type') !== 'page'){
        let clone:any = gEBID(seleElement)!.cloneNode(true);
        clone.style.top = px((top(seleElement) - top(movingTo)));
        clone.style.left = px((left(seleElement) - left(movingTo)));
        gEBID(seleElement)?.remove();
        gEBID(movingTo)?.append(clone);
      }
      // moving single component from page > canvas
      if(movingFrom !== 'canvas' && movingTo == 'canvas' && gEBID(seleElement)!.getAttribute('data-type') !== 'page'){
        let clone:any = gEBID(seleElement)!.cloneNode(true);
        
        clone.style.top = px(((mousePosition.y + scrollTop) - (objectCursorDifference.y - top(parent))) + scrollTop);
        clone.style.left = px((mousePosition.x + scrollLeft) - (objectCursorDifference.x - left(parent)) + scrollLeft)
        gEBID(seleElement)?.remove();
        gEBID('canvas')?.append(clone);
        
      }
      // moving single component from page > page
      if(movingFrom !== 'canvas'
       &&
        movingTo !== 'canvas'
       && 
        gEBID(seleElement)!.getAttribute('data-type') !== 'page'
       &&
        gEBID(movingFrom)!.getAttribute('data-type') == 'page'
        &&
        gEBID(movingTo)!.getAttribute('data-type') == 'page'
      ){
        let clone:any = gEBID(seleElement)!.cloneNode(true);

        clone.style.top = px(((e.clientY - (objectCursorDifference.y - top(gEBID(seleElement)!.parentElement!.id))) - top(movingTo)) + scrollTop);
        clone.style.left = px(((e.clientX - (objectCursorDifference.x - left(gEBID(seleElement)!.parentElement!.id))) - left(movingTo)) + scrollLeft);

        gEBID(seleElement)?.remove();
        gEBID(movingTo)?.append(clone);
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
      const wrapper = gEBID('selected-elements-wrapper')!
      /**
       * for each selected elements we will edit and append them to wrapper
       */
      selectedElements.map((each: string) => {
        /**
         * we clone them b/c they will be removed from the previous position temporarly
         */
        let copy: any = gEBID(each)?.cloneNode(true);

        /**
         * top and left position of the wrapper and canvas is different
         * that's why we update the elements position and append the new 
         * one to the wrapper
         */
        copy.style.top = px(((top(each) - multiSelectedElementsWrapperDivStartFrom.y)) + scrollTop);
        copy.style.left = px((left(each) - multiSelectedElementsWrapperDivStartFrom.x) + scrollLeft);
        gEBID(each)?.remove()
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
  const logic = new Logic('root', { CANAS_ID: 'canvas' })


  return (
    <>
      <div id="main"
      tabIndex={-1}
      style={{
        cursor: cursorStyle
      }}
      >

      {/* bottom mode changes */}
      <div id="left-tools">
        <div 
        style={{
          background: 'black',
          position: 'fixed',
          top: '12vh',
          left: '1vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '5vw',
          borderRadius: '5px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          // rowGap: '0.5vw',
          borderBottom: '1px solid white',
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
        <button onClick={() => gEBID('canvas')!.scrollTo({ top: top('center'), left: left('center')})}>center</button>
      </div>

      {/* canvas */}
      <div id="canvas"
      
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
        let id = e.target.id;

        // some checks
        let isCanvas = e.target.id === 'canvas' ? true : false;
        // let isItsParentCanvas = gEBID(id)!.parentElement!.id === 'canvas' ? true : false;
        /**
         * registor where the selected elements from
         * [ simply the parent of the element by the time they toched by pointer ]
         */
        if(!isCanvas){
        // if this element is not canvas
        set_movingFrom(gEBID(id)!.parentElement!.id)
        set_movingTo(gEBID(id)!.parentElement!.id)
        }
        set_fromWhereAreTheComponent(gEBID(e.target.id)!.parentElement!.id);

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
        if(selectedElements.length > 1 && e.target.id !== 'selected-elements-wrapper' && !e.shiftKey){
          // if user selects something before append those to the real dom

          /**
           * this makes a clone of elemnts in wrapper and 
           * append them to there original place like (canvas & page)
           * 
           */
        selectedElements.map((each: any) => {
          let copy: any = gEBID(each)?.cloneNode(true);
          copy.style.top = px(top(each) + scrollTop);
          copy.style.left = px(left(each) + scrollLeft);
          set_selectedElements([])
          gEBID(each)?.remove();
          gEBID('canvas')!.append(copy);
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
      if(e.target.id !== 'canvas'){ // this if statement will be replaced by modes // modes like text, move, select ...
        if(gEBID(e.target.id)!.parentElement!.id == 'canvas'){
          // this is for moving pages, components and anything inside canvas but not page
          let l: any = left(e.target.id);
          let t: any = top(e.target.id);
          set_objectCursorDifference({
          x: (e.clientX + scrollLeft) - (l + scrollLeft),
          y: (e.clientY + scrollTop) - (t + scrollTop)
        })
        }else {
          // this is for moving components only inside a page not inside canvas 
          let l: any = left(e.target.id) - left(gEBID(e.target.id)!.parentElement!.id);
        let t: any = top(e.target.id) - top(gEBID(e.target.id)!.parentElement!.id);
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
       * this works if you put pointer in the canvas
       */
      if(e.target.id === 'canvas'){

        // if canvas is working
        set_movingFrom('canvas');
        set_movingTo('canvas');

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


      onMouseMove={(e: any) => {
      /**
       * this is the code who set's selected component position
       * both top and left
       */
      if(startMovingObject){
        if(gEBID(seleElement)!.parentElement!.id === 'canvas') {
          gEBID(seleElement)!.style.top = px((e.clientY + scrollTop) - objectCursorDifference.y);
          gEBID(seleElement)!.style.left = px((e.clientX + scrollLeft) - objectCursorDifference.x);
        }
        else if(gEBID(seleElement)!.parentElement?.getAttribute('data-type') === 'page') {
          gEBID(seleElement)!.style.top = px(((e.clientY - scrollTop) - objectCursorDifference.y));
          gEBID(seleElement)!.style.left = px(((e.clientX - scrollLeft) - objectCursorDifference.x));
        }
        // this is where elements get appended inside and page and get out from page
        if(seleElement.length > 0 || selectedElements.length > 1){

          let all = gEBID('main')!.querySelectorAll('*');
          let results: any = [];
          let x_start = e.clientX + scrollLeft;
          let y_start = e.clientY + scrollTop;
          
          all.forEach((element: any) => {
            if(
              top(element.id) + scrollTop < y_start && 
              left(element.id) + scrollLeft < x_start &&
              right(element.id) + scrollLeft > x_start &&
              bottom(element.id) + scrollTop > y_start &&
              (element.id === 'canvas' || element.getAttribute('data-type') === 'page')
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
      
        let res = getCIArea(startSelectingFrom, includeSelectingUpto)
        set_selectedElements(res);
        
        // create a wrapper elemnt
        if(res.length == 1){
          // this means user selected one element only
          set_seleElement(res[0]);
        }else if(res.length > 1){
          // this means user selected multiple elements only
          
          let startFromMax = { x: 20000, y: 2000000 };
          let includeUpToMax = { x: -20000, y: -200000 };
          
          
          res.forEach((each: any) => {
            
            // some varialble to clean the code
            let eTop: any = top(each);
            let eLeft: any = left(each);
            let eRight: any = right(each);
            let eBottom: any = bottom(each);
            
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
          set_seleElement('selected-elements-wrapper');
        }

      }


      /**
       * if user is moving elements only not pages
       * we will actually move components inside the wrapper
       * wrapper in this code means the elements parent
       * if user's mouse starts grabbing the element from the out side (canvas)
       *        - when user enters pages we have to move the elment inside the page
       *
       * if user's mosue starts grabbing the elemtn from the inside (pages)
       *        - when user move the component to the outside (canvas) move the elemnent to outside
       */

        if(startMovingObject || (selectionStarted2 && selectionStarted)){
          
          // for go up
          if(mousePosition.y < 100){
            gEBID('canvas')?.scrollBy({ behavior: 'instant', top: -10, left: 0})
          }
          // for go down
          if(mousePosition.y > window.innerHeight - 50){            
            gEBID('canvas')?.scrollBy({ behavior: 'instant', top: 10, left: 0})
          }

          // for go up
          if(mousePosition.x < 100){
            gEBID('canvas')?.scrollBy({ behavior: 'instant', top: 0, left: -10})
          }
          // for go down
          if(mousePosition.x > window.innerWidth - 50){            
            gEBID('canvas')?.scrollBy({ behavior: 'instant', top: 0, left: 10})
          }

          if(startMovingObject){
            gEBID(seleElement)!.style.top = px((mousePosition.y + scrollTop) - objectCursorDifference.y);
            gEBID(seleElement)!.style.left = px((mousePosition.x + scrollLeft) - objectCursorDifference.x);
          }
          

        }
      }}


      onWheel={(e: any) => {

          // updating user's scroll amount 
          set_scrollTop(gScrlTop('canvas')!);
          set_scrollLeft(gScrLeft('canvas')!);

          gEBID('canvas')!.scrollBy({
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
      
      
      onKeyDown={(e: any) => {

        /**
         * WARNING:
         * remember if every thing is stable
         * make those functionalities dependent on not user's text editing event 
         * is enabled
         * [ simply : if user's editText state enabled those should not work]
         */

        // all key events actions related to canvas element are hear


        // those features work or not work based on users state
        if(!textEditingModeEnabled){

          /**
           * those are keys will not work as default if users are not editing text
           */
          let directionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
          if(directionKeys.some((key: any) => key == e.key)){
            e.preventDefault();
            let top_e = parseFloat(gEBID(seleElement)!.style.top);
            let left_e = parseFloat(gEBID(seleElement)!.style.left);
            switch(e.key){
              case 'ArrowUp':
                gEBID(seleElement)!.style.top = px(top_e - 1);
              break;
              case 'ArrowDown':
                gEBID(seleElement)!.style.top = px(top_e + 1);
              break;
              case 'ArrowLeft':
                gEBID(seleElement)!.style.left = px(left_e - 1);
              break;
              case 'ArrowRight':
                gEBID(seleElement)!.style.left = px(left_e + 1);
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
          selectedElements.map((each: any) => {
            if(gEBID(each) && each.length > 0 && logic.CANVA_ELEMENT_EXCEPTION.every((id: any) => id !== each)){
              gEBID(each)?.remove()
            }
          });
          set_seleElement('canvas');
          set_selectedElements(false);
          set_selectionStarted2(false);
          set_selectedElements([]);
        }else
        /**
         * select multiple feature by pressing ctr + a/A is here */ 
        if(e.key == 'a' && e.ctrlKey){

          logic.selectAll(
            'canvas',
            logic.CANVA_ELEMENT_EXCEPTION,
            set_selectedElements
            )
        }
        /**
         * move the elemnt forward
         */
        if(e.key == ']'){
          gEBID(seleElement)!.style.zIndex = gEBID(seleElement)!.style.zIndex + 1 
        }
        /**
         * move the elment backward
         */
        if(e.key == '['){
          gEBID(seleElement)!.style.zIndex = `${parseInt(gEBID(seleElement)!.style.zIndex) - 1}` 
        }
        }

  
      }}
      >
        {/* this makes the scrolling feature possible */}
        <div

        style={{
          position: 'absolute',
          top: px(window.innerHeight + scrollTop + 200000),
          left: px(window.innerWidth + scrollLeft + 200000),
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
          position: 'absolute'
        }}
        ></div>


<div id="page-1" data-type='page'
        style={{
          width: "480px",
          height: '800px',
          top: '10100px',
          left: '10100px',
          background: 'white',
          position: 'absolute',
          zIndex: 1
        }}
        >
      <h1
      style={{
        fontSize: '42px',
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '300px'
      }}
      id='titie-inside-page'>Hello I'm Page</h1>
        </div>

        {/* dev components*/}
      {(selectionStarted && selectionStarted2 && selectionType == 'components')
        &&
        <div id="select"
        style={{
          position: 'absolute',
          top: includeSelectingUpto.y > startSelectingFrom.y ? px(startSelectingFrom.y) : px(includeSelectingUpto.y),
          left: includeSelectingUpto.x > startSelectingFrom.x ? px(startSelectingFrom.x) : px(includeSelectingUpto.x),
          width: includeSelectingUpto.x > startSelectingFrom.x ? px(includeSelectingUpto.x - startSelectingFrom.x) : px(startSelectingFrom.x - includeSelectingUpto.x),
          height: includeSelectingUpto.y > startSelectingFrom.y ? px(includeSelectingUpto.y - startSelectingFrom.y) : px(startSelectingFrom.y - includeSelectingUpto.y),
        }}
        ></div>
      }

      {selectedElements.length > 1 && <div id='selected-elements-wrapper'
        style={{
          position: 'absolute',
          top: px(multiSelectedElementsWrapperDivStartFrom.y),
          left: px(multiSelectedElementsWrapperDivStartFrom.x),
          width: px((multiSelectedElementsWrapperDivInclude.x - multiSelectedElementsWrapperDivStartFrom.x)),
          height: px(multiSelectedElementsWrapperDivInclude.y - multiSelectedElementsWrapperDivStartFrom.y),
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
      {displayDevStates && <table id="states">
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
          <td>{selectedElements.map((each: any) => <p key={each}>{each}</p>)}</td>
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
            <td>{width(seleElement)}</td>
          </tr>
          <tr>
            <td>height</td>
            <td>{height(seleElement)}</td>
          </tr>
          <tr>
            <td>position value</td>
            <td>l: {left(seleElement)! + scrollLeft}<br/>t: {top(seleElement)! + scrollTop}<br/>r: {right(seleElement)!}<br/>b: {bottom(seleElement)}</td>
          </tr>
          <tr>
            <td>zIndex</td>
            <td>{gEBID(seleElement)?.style.zIndex}</td>
          </tr>

          </tbody>
        </table>}

      {/* those are element feature previewers and decorators */}
      {(document.getElementById(seleElement) && seleElement !== 'canvas') && <div id="decorators">
        
      {/* element descriptor */}
      {(!startMovingObject && gEBID(seleElement)) && <div 
      style={{
        position: 'absolute',
        top: px(top(seleElement) - 15),
        left: px(left(seleElement)),
        width: '6px',
        height: '6px',
        zIndex: 30,
        borderRadius: '50px',
        background: 'transparent',
        color: 'rgb(107, 154, 255)',
        fontSize: '12px'
    }}
      >{componentName(seleElement)}</div>}


      {/* rotate feature */}
      {(!startMovingObject && gEBID(seleElement)) &&<div 
      style={{
        position: 'absolute',
        top: px(top(seleElement) - 20),
        left: px(left(seleElement) + (width(seleElement) / 2)),
        width: '6px',
        height: '6px',
        background: 'rgb(107, 154, 255)',
        zIndex: 30,
        cursor: 'crosshair',
        borderRadius: '50px',

    }}
      />}

        {/* this is the top resize feature of element */}
        {(!startMovingObject && gEBID(seleElement)) && <div id="top-resize"
        style={{
          position: 'absolute',
          top: px(top(seleElement) - 1),
          left: px(left(seleElement)),
          width: px(width(seleElement)),
          height: '1px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ns-resize'
        }}
        ></div>}

        {/* top-left corner resize button */}
        {(!startMovingObject && gEBID(seleElement)) && <div id="topleft-resize"
        style={{
          position: 'absolute',
          top: px(top(seleElement) - 3),
          left: px(left(seleElement) - 3),
          width: '6px',
          height: '6px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'nw-resize'
        }}
        ></div>}


        {/* this is the right resize feature of element */}
        {(!startMovingObject && gEBID(seleElement)) && <div id="right-resize"
        style={{ 
          position: 'absolute',
          top: px(top(seleElement)),
          left: px(right(seleElement)),
          width: '1px',
          height: px(height(seleElement)),
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ew-resize'
        }}
        ></div>}

        {/* top-right corner resize button */}
        {(!startMovingObject && gEBID(seleElement)) && <div id="topright-resize"
        style={{
          position: 'absolute',
          top: px(top(seleElement) - 3),
          left: px(right(seleElement) - 3),
          width: '6px',
          height: '6px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ne-resize'
        }}
        ></div>}

        {/* this is the bottom resize feature of element */}
        {(!startMovingObject && gEBID(seleElement)) && <div id="bottom-resize"
        style={{ 
          position: 'absolute',
          top: px(bottom(seleElement)),
          left: px(left(seleElement)),
          width: px(width(seleElement)),
          height: '1px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ns-resize'
        }}
        ></div>}

        {/* bottom-right corner resize button */}
        {(!startMovingObject && gEBID(seleElement)) && <div id="bottomright-resize"
        style={{
          position: 'absolute',
          top: px(bottom(seleElement) - 3),
          left: px(right(seleElement) - 3),
          width: '6px',
          height: '6px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'nw-resize'
        }}
        ></div>}

        {/* this is the left resize feature of element */}
        {(!startMovingObject && gEBID(seleElement)) && <div id="left-resize"
        style={{ 
          position: 'absolute',
          top: px(top(seleElement)),
          left: px(left(seleElement) - 1),
          width: '1px',
          height: px(height(seleElement)),
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ew-resize'
        }}
        ></div>}

        {/* bottom-left corner resize button */}
        {(!startMovingObject && gEBID(seleElement)) && <div id="bottomleft-resize"
        style={{
          position: 'absolute',
          top: px(bottom(seleElement) - 3),
          left: px(left(seleElement) - 3),
          width: '6px',
          height: '6px',
          zIndex: 30,
          background: 'rgb(107, 154, 255)',
          cursor: 'ne-resize'
        }}
        ></div>}
      </div>}



      {/* context menu */}
      {(displayContext && gEBID(seleElement)) && <div id='context-menu'
      style={{
        top: px(contextMenuPosition.y),
        left: px(contextMenuPosition.x),
        zIndex: 50000
      }}
      >
        <p
        onClick={() => {
          let exception = logic.CANVA_ELEMENT_EXCEPTION.every((each: any) => each !== seleElement);
          if(exception)
            gEBID(seleElement)?.remove()
          set_displayContext(false)
        }}
        >Delete <span>del</span></p>
        <p>Copy <span>ctr + c</span></p>
        <p>Paste <span>ctr + v</span></p>
        <p>Edit <span>ctr + e</span></p>
      </div>}
      
      </div>
    </>
  )
}

export default App
