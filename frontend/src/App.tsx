import { MouseEvent, WheelEvent, useEffect, useState, useSyncExternalStore } from 'react'
import reactLogo from './assets/react.svg'
import appLogo from '/vite.svg'
import './App.css'
import gEBID from './modules/gEBID';
import { bottom, height, left, right, top, width } from './modules/getStyle';
import { px } from './modules/unit';
import { gScrLeft, gScrlTop } from './modules/scroll';
import { getCIArea } from './modules/getCIArea';

function App() {

  // indicates how much user scrolled
  const [scrollTop, set_scrollTop] = useState(0);
  const [scrollLeft, set_scrollLeft] = useState(0);
  
  // indicates the selection event
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
  // show all selected elements wrapper
  const [multiSelectedElementsWrapperDivStartFrom, set_multiSelectedElementsWrapperDivStartFrom] = useState({ x: 0, y: 0});
  const [multiSelectedElementsWrapperDivInclude, set_multiSelectedElementsWrapperDivInclude] = useState({ x: 0, y: 0});


  // seleElement
  const [seleElement, set_seleElement] = useState('');
  const [zIndex, set_zIndex] = useState(0)

  // cursor based
  const [cursorStyle, set_cursorStyle] = useState('default');

  // movement
  const [startMovingObject, set_startMovingObject] = useState(false);
  const [objectCursorDifference, set_objectCursorDifference] = useState({x: 0, y: 0})
  const [movementX, set_movementX] = useState(0);
  
  // editing features
  const [textEditingModeEnabled, set_textEditingModeEnabled] = useState(false);
  



  useEffect(() => {
    console.log("page initiated");

  }, [])

  useEffect(() => {
    // updating user's scroll amount 
    set_scrollTop(gScrlTop('canvas')!);
    set_scrollLeft(gScrLeft('canvas')!);    
  })

  window.addEventListener('mousemove', (e: any) => {
    if(selectionStarted && !startMovingObject){
      set_selectionStarted2(true);
      set_includeSelectingUpto({
      x: e.clientX + scrollLeft,
      y: e.clientY + scrollTop})
    }

    

  })

  window.onmouseup = (e: any) => {
    set_startMovingObject(false);
    if(selectionStarted && selectionStarted2){
      
      set_selectionStarted(false);
      set_selectionStarted2(false);
      let res = getCIArea(startSelectingFrom, includeSelectingUpto)
      set_selectedElements(res);
      
      // create a wrapper elemnt
      if(res.length == 1){
        // this means user selected one element only

      }else if(res.length > 1){
        // this means user selected multiple elements only
        
        let startFromMax = { x: 20000, y: 2000000 };
        let includeUpToMax = { x: -20000, y: -200000 };
        
        
        res.forEach((each: any) => {
          
          // some varialble to clean the code
          let eTop = top(each);
          let eLeft = left(each);
          let eRight = right(each);
          let eBottom = bottom(each);
          
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

        set_multiSelectedElementsWrapperDivStartFrom(startFromMax);
        set_multiSelectedElementsWrapperDivInclude(includeUpToMax)
        console.log('height: ' + (includeUpToMax.y - startFromMax.y))
      }
    }
    
  }

  return (
    <>
      <div id="main"
      tabIndex={-1}
      style={{
        cursor: cursorStyle
      }}
      >

      {/* upper tools */}
      <div id="upper-tools">
        <div id="logo"/>
      </div>

      {/* canvas */}
      <div id="canvas"
      tabIndex={-1}
      draggable={false}
      onMouseDown={(e: MouseEvent) => {
      if(
        e.target.id !== 'select'
        ){
        set_seleElement(e.target.id);
      }
      
      if(e.target.id !== 'canvas'){ // this if statement will be remlaced by modes
        set_objectCursorDifference({
          x: (e.clientX + scrollLeft) - (left(e.target.id) + scrollLeft),
          y: (e.clientY + scrollTop) - (top(e.target.id) + scrollTop)
        })
        set_startMovingObject(true)
      }

      if(e.target.id === 'canvas'){
          set_selectionType('components');
          set_startSelectingFrom({
            x: e.clientX + scrollLeft,
            y: e.clientY + scrollTop
          })
          
          set_includeSelectingUpto({
            x: e.clientX + scrollLeft,
            y: e.clientY + scrollTop
          })
          set_selectedElements([]);
          set_selectionStarted(true);
        }
      }}
      onMouseMove={(e: MouseEvent) => {
      if(startMovingObject){
        gEBID(seleElement)!.style.top = px((e.clientY + scrollTop) - objectCursorDifference.y)
        gEBID(seleElement)!.style.left = px((e.clientX + scrollLeft) - objectCursorDifference.x)
      }
      }}
      onWheel={(e: MouseEvent) => {
            // updating user's scroll amount 
          set_scrollTop(gScrlTop('canvas')!);
          set_scrollLeft(gScrLeft('canvas')!);

      }}
      onClick={(e: MouseEvent) => {
        /*
        this is for selecting elements one by one
        removing element from selected ones
        // if this element is selected it will remove it from the selectedElements List
        // if this element is not selected it will add it to the selectedElements List
        */
          // and this feature needs the user to hold shift key to
          if(e.shiftKey){
            let id = e.target.id;
            let exists: any = selectedElements.some((element: any) => element === id);
            if(exists){
              set_selectedElements(selectedElements.filter((each: any) => each !== id));
            }else if(!exists) {
              set_selectedElements([...selectedElements, id]);  
            }
          }

      }}
      >
        <div
        style={{
          position: 'absolute',
          top: px(window.innerHeight + scrollTop + 100),
          left: px(window.innerWidth + scrollLeft + 100),
          width: '10px',
          height: '10px',
          background: 'transparentcd front'
        }}
        ></div>

        <button id='btn'
        style={{
          position: 'absolute',
          top: '200px',
          left: '200px',
          padding: '10px 20px'
        }}
        >Click Here</button>
        <h1
        id='title-1'
        style={{ position: 'absolute', top: '100px', background: 'none', fontSize: '32px', zIndex: zIndex + 1}}>I'm The Title Sir</h1>

        {/* <div id="page-0" data-type='page'
        style={{
          width: "480px",
          height: '800px',
          top: '100px',
          left: '250px',
          background: 'white',
          position: 'absolute'
        }}
        ></div> */}


<div id="page-1" data-type='page'
        style={{
          width: "480px",
          height: '800px',
          top: '100px',
          left: '750px',
          background: 'white',
          position: 'absolute'
        }}
        ></div>

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

      {selectedElements.length > 1 && <div id='selected-elements-wapper'
        style={{
          position: 'absolute',
          top: px(multiSelectedElementsWrapperDivStartFrom.y + scrollTop),
          left: px(multiSelectedElementsWrapperDivStartFrom.x + scrollLeft),
          width: px((multiSelectedElementsWrapperDivInclude.x - multiSelectedElementsWrapperDivStartFrom.x)),
          height: px(multiSelectedElementsWrapperDivInclude.y - multiSelectedElementsWrapperDivStartFrom.y),
        }}
        >

        </div>}
      </div>


      
      {/* 
      states are a key value pairs of useState hooks list 
      those display the value in real time
      */}
      {/* root states */}
      <table id="states">
        <tbody>
        <tr>
          <th>name</th><th>value</th>
        </tr>
        <tr>
          <td>selectionStarted</td>
          <td>{selectionStarted ? '🟢' : '🔴'}</td>
        </tr>
        <tr>
          <td>selectedElement</td>
          <td>#{seleElement}</td>
        </tr>
        <tr>
          <td>startSelectingFrom</td>
          <td>{startSelectingFrom.x} <br /> {startSelectingFrom.y}</td>
        </tr>
        <tr>
          <td>includeSelectingUpto</td>
          <td>{includeSelectingUpto.x} <br /> {includeSelectingUpto.y}</td>
        </tr>
        <tr>
          <td>selectionType</td>
          <td>{selectionType}</td>
        </tr>
        <tr>
          <td>scroll</td>
          <td>{scrollTop}<br/>{scrollLeft}</td>
        </tr>
        <tr>
          <td>objectCursorDifference</td>
          <td>{objectCursorDifference.x} <br /> {objectCursorDifference.y}</td>
        </tr>
        <tr>
          <td>startMovingObject</td>
          <td>{startMovingObject ? '🟢' : '🔴'}</td>
        </tr>
        <tr>
          <td>selectedElements</td>
          <td>{selectedElements.map((each: any) => <p key={each}>{each}</p>
          )}</td>
        </tr>
        <tr>
          <td>multiSelectedElementsWrapperDiv</td>
          <td>{multiSelectedElementsWrapperDivStartFrom.x}:{multiSelectedElementsWrapperDivInclude.x}</td>
          <td>{multiSelectedElementsWrapperDivStartFrom.y}:{multiSelectedElementsWrapperDivInclude.y}</td>
        </tr>

        </tbody>
      </table>

      {/* <table id="states">
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
          <td>position value</td>
          <td>l: {left(seleElement)! + scrollLeft}<br/>t: {top(seleElement)! + scrollTop}<br/>r: {right(seleElement)!}<br/>b: {bottom(seleElement)}</td>
        </tr>
        </tbody>
      </table> */}

      {/* those are element feature previewers and decorators */}
      {(document.getElementById(seleElement) && seleElement !== 'canvas') && <div id="decorators">
        

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
        {(!startMovingObject && gEBID(seleElement) != false) && <div id="top-resize"
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
        {(!startMovingObject && gEBID(seleElement) != false) && <div id="topleft-resize"
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
        {(!startMovingObject && gEBID(seleElement) != false) && <div id="right-resize"
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
        {(!startMovingObject && gEBID(seleElement) != false) && <div id="topright-resize"
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
        {(!startMovingObject && gEBID(seleElement) != false) && <div id="bottom-resize"
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
        {(!startMovingObject && gEBID(seleElement) != false) && <div id="bottomright-resize"
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
        {(!startMovingObject && gEBID(seleElement) != false) && <div id="left-resize"
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
        {(!startMovingObject && gEBID(seleElement) != false) && <div id="bottomleft-resize"
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
      
      </div>
    </>
  )
}

export default App
