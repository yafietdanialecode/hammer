import { MouseEvent, useEffect, useState } from 'react'
import './App.css'
import gEBID from './modules/gEBID';
import { bottom, height, left, right, top, width } from './modules/getStyle';
import { px } from './modules/unit';
import { gScrLeft, gScrlTop } from './modules/scroll';
import { getCIArea } from './modules/getCIArea';
import Logic from './modules/Logic';

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
  const [selectedElements, set_selectedElements]: any = useState([]);
  // selected elements difference between 

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
  



  useEffect(() => {
    console.log("page initiated");

  }, [])

  useEffect(() => {
    // updating user's scroll amount 
    set_scrollTop(gScrlTop('canvas')!);
    set_scrollLeft(gScrLeft('canvas')!);    
  })

  window.addEventListener('mousemove', (e: any) => {

    // update mouse position
    set_mousePosition({x: e.clientX, y: e.clientY});
    

    if(selectionStarted && !startMovingObject){
      set_selectionStarted2(true);
      set_includeSelectingUpto({
      x: e.clientX + scrollLeft,
      y: e.clientY + scrollTop})
    }

    

  })

  window.onmouseup = (e: any) => {

    set_startMovingObject(false);
    set_selectionStarted(false);
    set_selectionStarted2(false); 

     // saving the difference

    if(selectedElements.length > 1 && !startMovingObject){
      const wrapper = gEBID('selected-elements-wrapper')!
      selectedElements.map((each: string) => {
        let copy: any = gEBID(each)?.cloneNode(true);
        // some editings
        copy.style.top = px(((top(each) - multiSelectedElementsWrapperDivStartFrom.y)) + scrollTop);
        copy.style.left = px((left(each) - multiSelectedElementsWrapperDivStartFrom.x) + scrollLeft);
        gEBID(each)?.remove()
        wrapper.append(copy)

      })
    }
    
  }

  window.oncontextmenu = (e: any) => {
    e.preventDefault();
    set_displayContext(true)
    set_contextMenuPosition({
      x: e.clientX,
      y: e.clientY
    })
  }

  const logic = new Logic('root', { CANAS_ID: 'canvas' })
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

      onMouseDown={(e: any) => {
        set_displayContext(false)

        if(selectedElements.length > 1 && e.target.id !== 'selected-elements-wrapper'){
          // if user selects something before append those to the real dom

        selectedElements.map((each: any) => {
          let copy: any = gEBID(each)?.cloneNode(true);
          copy.style.top = px(top(each) + scrollTop);
          copy.style.left = px(left(each) + scrollLeft);

          gEBID(each)?.remove();
          gEBID('canvas')!.append(copy);
        })
        }


      if(
        e.target.id !== 'select'
        ){
        set_seleElement(e.target.id);
      }
      
      if(e.target.id !== 'canvas'){ // this if statement will be remlaced by modes
        let l: any = left(e.target.id);
        let t: any = top(e.target.id);
        set_objectCursorDifference({
          x: (e.clientX + scrollLeft) - (l + scrollLeft),
          y: (e.clientY + scrollTop) - (t + scrollTop)
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
          set_selectionStarted(true);
          set_selectedElements([]);

        }
      }}
      onMouseMove={(e: MouseEvent) => {

        if(startMovingObject){
        gEBID(seleElement)!.style.top = px((e.clientY + scrollTop) - objectCursorDifference.y);
        gEBID(seleElement)!.style.left = px((e.clientX + scrollLeft) - objectCursorDifference.x);
        
      }

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
      }}


      onWheel={(e: MouseEvent) => {

            // updating user's scroll amount 
          set_scrollTop(gScrlTop('canvas')!);
          set_scrollLeft(gScrLeft('canvas')!);
          
      }}
      
      
      onKeyDown={(e: any) => {
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
        if(e.key == 'a' && e.ctrlKey){
          logic.selectAll(
            'canvas',
            logic.CANVA_ELEMENT_EXCEPTION,
            set_selectedElements
            )
        }
        if(e.key == ']'){
          gEBID(seleElement)!.style.zIndex = gEBID(seleElement)!.style.zIndex + 1 
        }
        if(e.key == '['){
          gEBID(seleElement)!.style.zIndex = `${parseInt(gEBID(seleElement)!.style.zIndex) - 1}` 
        }
      }}
      >
        {/* this makes the scrolling feature possible */}
        <div

        style={{
          position: 'absolute',
          top: px(window.innerHeight + scrollTop + 100),
          left: px(window.innerWidth + scrollLeft + 100),
          width: '10px',
          height: '10px',
          background: 'transparent',
          pointerEvents: 'none'
        }}
        ></div>

        <button id='btn'
        style={{
          position: 'absolute',
          top: '200px',
          left: '200px',
          padding: '10px 20px',
          zIndex: 1,
          width: '150px'
        }}
        >Click Here</button>
        <h1
        id='title-1'
        style={{ width: '250px', position: 'absolute', top: '100px', background: 'none', fontSize: '32px', zIndex: 2}}>I'm The Title Sir</h1>

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
          position: 'absolute',
          zIndex: 3
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
      <table id="states">
        <tbody>
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
      </table>

      <table id="states">
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
        <tr>
          <td>zIndex</td>
          <td>{gEBID(seleElement)?.style.zIndex}</td>
        </tr>

        </tbody>
      </table>

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
        fontSize: '10px'
    }}
      >{gEBID(seleElement)?.tagName}</div>}


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
