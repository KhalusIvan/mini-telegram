import React, {useEffect, useRef, useState} from 'react'
import "../../style/cropping.css"

export const Cropping = (props) => {
    let canv = useRef(null);
    let sliderRef = useRef(null);
    let ctx;
    let radius;
    let startMove = false, x, y, shiftX = 0, shiftY = 0;
    let [slider,setSlider] = useState(0);
    let [first, delFirst] = useState(true);
    let [circleCoord, setCirclecoord] = useState([0,0])
    let [step, setStep] = useState(1)
    var img = new Image();
    img.src = props.toBase64Result;
    function workWithCanvas() {
        ctx = canv.current.getContext('2d');

        img.onload = function() {
            canv.current.width = img.width;
            canv.current.height = img.height;
            if(document.getElementById("modal_dialog").offsetHeight > window.innerHeight) {
                document.getElementById("modal_dialog").classList.add("modal-dialog-scrollable")
            }
            if(first) {
                let st = canv.current.width > canv.current.height ? canv.current.height : canv.current.width
                st = st / 600
                st = Math.round(st)
                if(st < 1)
                    st = 1
                console.log(st)
                setStep(st)
                setCirclecoord([img.width / 2, img.height / 2])
            }
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canv.current.width, canv.current.height);
            ctx.beginPath();
            ctx.lineWidth = 5 * step;
            radius = slider
            ctx.arc(circleCoord[0], circleCoord[1], radius, 0, Math.PI*2, true);
            ctx.stroke();
            sliderRef.current.min = canv.current.width > canv.current.height ? canv.current.height / 4 : canv.current.width / 4
            sliderRef.current.max = canv.current.width > canv.current.height ? canv.current.height / 2 : canv.current.width / 2
            if(sliderRef.current.value === sliderRef.current.min && first) {
                setSlider(+(sliderRef.current.max / 2 + sliderRef.current.min / 2))
                delFirst(false)
            }
            canv.current.onmousedown = function(e) {
                x = e.clientX;
                y = e.clientY;
                startMove = true;
            }

            canv.current.onmouseup = function() {
                startMove = false
                setCirclecoord([circleCoord[0]-shiftX, circleCoord[1] - shiftY])
            }

            canv.current.onmouseout = function() {
                if (startMove) {
                    startMove = false
                    setCirclecoord([circleCoord[0]-shiftX, circleCoord[1] - shiftY])
                }
            }

            canv.current.onmousemove = function(e) {
                if(startMove) {
                    // центр
                    if(!(circleCoord[0]- shiftX - radius < 0 || circleCoord[0]- shiftX + radius > canv.current.width)) {
                        shiftX = x - e.clientX;
                    }      
                    // право
                    if (x - e.clientX > shiftX && circleCoord[0] - shiftX + radius > canv.current.width){
                        shiftX = x - e.clientX;
                    }
                    //ліво 
                    if (x - e.clientX < shiftX && circleCoord[0] - shiftX - radius < 0){
                        shiftX = x - e.clientX;
                    } 
                    if(!(circleCoord[1] - shiftY - radius < 0 || circleCoord[1] - shiftY + radius > canv.current.height)){
                        shiftY = y - e.clientY;
                    } 
                    if (y - e.clientY > shiftY && circleCoord[1] - shiftY + radius > canv.current.height){
                        shiftY = y - e.clientY;
                    } 
                    if (y - e.clientY < shiftY && circleCoord[1] - shiftY - radius < 0){
                        shiftY = y - e.clientY;
                    } 
                    shiftX *= step
                    shiftY *= step
                    ctx.clearRect(0, 0, canv.current.width, canv.current.height);
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canv.current.width, canv.current.height);
                    ctx.beginPath();
                    ctx.arc(circleCoord[0] - shiftX, circleCoord[1] - shiftY, radius, 0, Math.PI*2, true);
                    ctx.stroke();
                }
            }
        }
         
    }

    async function save() {
        let square = canv.current.width > canv.current.height ? canv.current.height : canv.current.width
        canv.current.width = square;
        canv.current.height = square;
        ctx.drawImage(img, circleCoord[0] - radius + 5, circleCoord[1] - radius + 5, radius*2, radius*2, 10, 10, square, square);
        let imageBlob = await new Promise(resolve => canv.current.toBlob(resolve, 'image/jpeg'));
        let comprimed;
        if(imageBlob.size > 500000){
            comprimed = await new Promise(resolve => canv.current.toBlob(resolve, 'image/jpeg',0.2));
        }else if(imageBlob.size > 100000 && imageBlob.size <= 500000){
            comprimed = await new Promise(resolve => canv.current.toBlob(resolve, 'image/jpeg',0.4));
        }else if(imageBlob.size > 50000 && imageBlob.size <= 100000){
            comprimed = await new Promise(resolve => canv.current.toBlob(resolve, 'image/jpeg',0.6));
        }else if(imageBlob.size > 10000 && imageBlob.size <= 50000){
            comprimed = await new Promise(resolve => canv.current.toBlob(resolve, 'image/jpeg',0.8));
        }else{
            comprimed = imageBlob;
        }
        
        await props.setIsCropping(await comprimed)
        
    }

    useEffect(() => {
        workWithCanvas();
        setSlider(+sliderRef.current.value)
      },[]);

      useEffect(() => {
        workWithCanvas();
    }, [slider, circleCoord, radius])

    function radiusChanger(e){
        if(circleCoord[0] - radius - 1 < 0) {
            if(circleCoord[1] - radius - 1 < 0) {
                setCirclecoord([circleCoord[0] + +e.target.value - radius,circleCoord[1] + +e.target.value - radius])
            } else if (circleCoord[1] + radius + 1 > canv.current.width){
                setCirclecoord([circleCoord[0] + +e.target.value - radius,circleCoord[1] - (+e.target.value - radius)])
            }
            setCirclecoord([circleCoord[0] + +e.target.value - radius,circleCoord[1]])
        } else if (circleCoord[0] + radius + 1 > canv.current.width){
            if(circleCoord[1] - radius - 1 < 0) {
                setCirclecoord([circleCoord[0] - (+e.target.value - radius),circleCoord[1] + +e.target.value - radius])
            } else if (circleCoord[1] + radius + 1 > canv.current.width){
                setCirclecoord([circleCoord[0] - (+e.target.value - radius),circleCoord[1] - (+e.target.value - radius)])
            }
            setCirclecoord([circleCoord[0] - (+e.target.value - radius),circleCoord[1]])
        }else if(circleCoord[1] - radius - 1 < 0) {
            setCirclecoord([circleCoord[0],circleCoord[1] + +e.target.value - radius])
        } else if (circleCoord[1] + radius + 1 > canv.current.width){
            setCirclecoord([circleCoord[0],circleCoord[1] - (+e.target.value - radius)])
        }
        setSlider(+e.target.value)
    }

    return (
        <>
            <div id="modal_dialog" className={"modal-dialog"}>
                <div id="modal-content" className="modal-content">
                    <div id="modal-header" className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Обрізка фото</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                    
                        <div id="slidecontainer" className="slidecontainer">
                            <input ref={sliderRef} type="range" min="1" max="100" value={slider} onChange={(e)=> radiusChanger(e)} className="slider" id="myRange" />
                        </div>

                        <canvas ref={canv} className="w-100 h-100" id="canvas"></canvas>
                    </div>
                    <div id="modal-footer" className="modal-footer">
                        <button type="button" onClick={() => save()} className="btn btn-primary">Зберегти</button>
                    </div>
                </div>
            </div>
        </>
    )
}
