// 16-09-2021
{
    // усі галереї
    const levusSlider = document.querySelectorAll('.levus-touch-gallery'); 

    // для вставки лайтбоксу
    const body = document.getElementsByTagName('body')[0];

    // every slider
    for(let slider of levusSlider){

        // оримуємо відступ згори до слайдера -- отримати розміри картинок тільки тоді, коли проскролять
        const offsetTop = slider.offsetTop;

        /////////////////////////////
        // ховаємо до завантаження // 
        /////////////////////////////

        setTimeout(() => {
            
            slider.classList.add('load');
        }, 1500);

        // список з великими слайдами
        const slidesUl = slider.querySelector('.slides ul');

        // усі слайди || all slides    
        const slides = slidesUl.querySelectorAll('li');

        // усі картинки у слайдах || all pictures from slides
        const images = slidesUl.querySelectorAll('img');

        // кількість слайдів || quantity slides
        const length = slides.length;

        // додаємо айді усім слайдам || set data-id attribute
        for(let i = 0; i < length; i++){

            slides[i].dataset.id = i;
        }

        ////////////////////////////////////////////////////
        // генеруємо блок з тумбіками || thumbs generated //
        ////////////////////////////////////////////////////

        let pics = '';

        for(let i = 0; i < length; i++){

            const pic = `<li data-id="${i}"><img src="${images[i].dataset.thumb}" alt=""></li>`;
            pics += pic;
        }

        const thumbsWrapper = document.createElement('div');
        thumbsWrapper.className = 'thumbs';
        const thumbs = document.createElement('ul');    

        thumbs.innerHTML = pics;
        thumbsWrapper.append(thumbs);
        slider.append(thumbsWrapper);

        ////////////////////////
        // генеруємо пімпочки //
        ////////////////////////

        const dots = document.createElement('ul');
        dots.className = 'dots';

        for(let i = 0; i < length; i++){

            const li = document.createElement('li');
            li.dataset.id = i;

            if(i === 0){
                li.className = 'active';
            }

            dots.append(li);
        }

        slider.append(dots);

        ////////////
        // іконка //
        ////////////

        const icon = document.createElement('div');
        icon.className = 'icon';
        slider.prepend(icon);

        //////////////////////////
        // перемінні для свайпу //
        //////////////////////////

        // drag check
        let drag, flag = false;

        // drag vars (current -- id current's element)
        let start, finish, current, opacity = 0;
        let shift = 1;

        // елементи лайтбокса
        let insertData = '';

        // create lightbox block
        const lightbox = document.createElement('div');
        lightbox.id = 'levus-lightbox';

        // якщо кількість більше 4, то робимо грід, якщо менше -- центруємо
        if(length > 4){

            thumbs.style.display = 'grid';

            // зсув на 1 елемент вліво || set shift to 1 el
            thumbs.style.left = '-25%';

            // встановлюємо кількість вічок
            thumbs.style.gridTemplateColumns = `repeat(${length},25%)`;

            // центруємо активний елемент || active element centered
            for(let i = 0; i < 2; i++){

                const last = thumbs.lastElementChild;
                thumbs.prepend(last);
            }
        } else {

            const lis = thumbs.querySelectorAll('li');

            thumbs.style.display = 'flex';
            thumbs.style.alignItems = 'center';
            thumbs.style.justifyContent = 'center';

            for(let li of lis){
                
                li.style.width = '25%';
            }
        }

        //////////////////////////////////////
        // масив для позиціонування слайдів //
        //////////////////////////////////////

        // transformX
        let elements = [];

        // set transformX
        for(let i = 0; i < length; i++){

            if(i === length-1){

                elements.push(-100);
            } else if(i === 0){

                elements.push(0);
            } else {

                elements.push(100);
            }
        }

        // малюємо слайди та тумбіки після завантаження сторінки
        render();

        // події
        for(let i = 0; i < length; i++){

            // тимчасова перемінна для зручності || temporary var
            const slide = slides[i];

            // disable drag image (for firefox)
            slide.addEventListener('dragstart', event => event.preventDefault());

            slide.addEventListener('pointerdown', sliderStart);
            slide.addEventListener('pointermove', sliderMove);
            slide.addEventListener('pointerup', sliderEnd);
            slide.addEventListener('pointercancel', sliderEnd);
            slide.addEventListener('pointerleave', sliderEnd);

            // disable click
            slide.addEventListener('click', event => event.preventDefault());
        }

        // клік на тумбік
        thumbs.addEventListener('click', event => {

            const id = event.target.parentNode.dataset.id;

            // якщо поточний слайд має номер більший за номер тумбіка
            if(current > id){

                for(let i = 0; i < Math.abs(current - id); i++){

                    const last = elements.shift();
                    elements.push(last);                
                }
            }

            // якщо поточний слайд має номер менший за номер тумбіка
            if(current < id){

                for(let i = 0; i < Math.abs(current - id); i++){

                    const first = elements.pop();
                    elements.unshift(first);                
                }
            }

            render();
        });

        // клік на пімпочку
        dots.addEventListener('click', event => {

            if(event.target.tagName === 'LI'){

                const id = event.target.dataset.id;

                // якщо поточний слайд має номер більший за номер тумбіка
                if(current > id){
        
                    for(let i = 0; i < Math.abs(current - id); i++){
        
                        const last = elements.shift();
                        elements.push(last);                
                    }
                }
        
                // якщо поточний слайд має номер менший за номер тумбіка
                if(current < id){
        
                    for(let i = 0; i < Math.abs(current - id); i++){
        
                        const first = elements.pop();
                        elements.unshift(first);                
                    }
                }
        
                render();
            }
        });

        // висота блоку для слайдів
        setMaxHeightSlider();

        // висота блоку для слайдів
        window.addEventListener('resize', setMaxHeightSlider);
    
        // lightbox 
        document.addEventListener('pointerdown', lightboxStart);
        document.addEventListener('pointermove', lightboxMove);
        document.addEventListener('pointerup', lightboxEnd);
        document.addEventListener('pointercancel', lightboxEnd);

        // клік на іконку (запуск лайтбокса)
        slider.addEventListener('click', event => {

            if(event.target.classList.contains('icon')){

                const slides = slider.querySelectorAll('.slides a');

                for(let i = 0; i < length; i++){
                    
                    if(elements[i] === 0){
                        opacity = 1;
                    } else {
                        opacity = 0;
                    }

                    insertData += `
                        <picture style="transform:translateX(${elements[i]}%);opacity:${opacity}">
                            <img 
                                src="${slides[i].href}" 
                                alt="${slides[i].title}" 
                                draggable="false" 
                                class="levus-lightbox-picture">
                        </picture>`;
                }

                // create lightbox desc
                const desc = '<div id="levus-lightbox-desc"></div>';

                // prepared data to insert to body
                lightbox.innerHTML = insertData;
                lightbox.innerHTML += desc;

                // isert data to body
                body.append(lightbox);

                setTimeout(() => {
                    
                    lightbox.className = 'active';
                }, 60);

                // view desc in bottom
                lightboxDesc(current);
            }
        });

        // close lightbox
        lightbox.addEventListener('click', event => {

            if(event.target.tagName === 'PICTURE'){

                lightboxClose();
            }
        });

        // keyboard events
        document.addEventListener('keydown', event => {

            // close lightbox
            if(event.key === 'Escape' || event.code === 'Escape'){

                lightboxClose();
            }

            // to left
            if(event.key === 'ArrowLeft' || event.code === 'ArrowLeft'){

                const first = elements.pop();
                elements.unshift(first);

                // if exists (if exists lightbox)
                document.querySelector('#levus-lightbox') && lightboxReload();

                render();
            }

            // to right
            if(event.key === 'ArrowRight' || event.code === 'ArrowRight'){
                
                const last = elements.shift();
                elements.push(last);

                // if exists (if exists lightbox)
                document.querySelector('#levus-lightbox') && lightboxReload();

                render();
            }

        });

        ///////////////
        // functions //
        ///////////////

        // /////////
        // слайди //
        // /////////

        // натискання
        function sliderStart(event){

            drag = true;

            // where it was pressed
            start = event.pageX;

            // console.log('scrollStart')
        }

        // рух мишкою
        function sliderMove(event){

            if(drag){

                // куди дотягнули || where it was moved
                finish = event.pageX;

                // якщо вліво || if to left
                if(finish - start < 0){

                    shift = finish - start;

                    if(flag === false){


                        flag = true;
                    }

                } 
                
                // якщо вправо || if to right
                if(finish - start > 0) { 

                    shift = Math.abs(start - finish);

                    if(flag === false){


                        flag = true;
                    }

                }

                // speed * 2
                this.style.transform = `translateX(${shift*2}px)`;

                // cursor grab
                this.querySelector('a').className = 'grab';
            }
        }

        // відпускання мишки + вихід за край слайду
        function sliderEnd(){
            if(drag){

                // to right
                if(finish - start < 0){
                    
                    const first = elements.pop();
                    elements.unshift(first);
                } 

                // to left
                if(finish - start > 0) {
                    
                    const last = elements.shift();
                    elements.push(last);
                }

                render();

                // set null
                drag = false;

                // set null
                flag = false;

                // cursor default
                this.querySelector('a').className = '';
            }
            
        }

        //////////////
        // лайтбокс //
        //////////////

        // натискання
        function lightboxStart(event){

            if(event.target.classList.contains('levus-lightbox-picture')){

                flag = true;

                event.target.classList.add('touch');

                start = event.pageX;
            }
        }
        
        // рух мишкою
        function lightboxMove(event){

            if(event.target.classList.contains('levus-lightbox-picture')){

                const el = event.target.parentNode;

                if(flag === true){
                
                    finish = event.pageX;

                    // if to left
                    if(finish - start < 0){

                        // shift = (finish - start) / 2;
                        shift = finish - start;
                    } 
                    
                    // if to right
                    if(finish - start > 0) { 

                        // shift = Math.abs(start - finish) / 2;
                        shift = Math.abs(start - finish);
                    }

                    el.style.transform = `translateX(${shift}%)`;
                }
            }
        }

        // відпускання мишки + вихід за край слайду
        function lightboxEnd(event){

            if(flag === true){

                if(finish - start < 0){

                    const first = elements.pop();
                    elements.unshift(first);
                } 
                
                if(finish - start > 0) { 

                    const last = elements.shift();
                    elements.push(last);
                }

                event.target.classList.remove('touch');

                lightboxReload();
                render();
            }

            flag = false;
        }

        // закриваємо лайтбокс
        function lightboxClose(){

            setTimeout(() => {
        
                lightbox.classList.remove('active');
            }, 60);
        
            setTimeout(() => {
                
                lightbox.remove();
            }, 480); 

            // clear lightbox content
            insertData = '';
        }

        // оновлюємо лайтбокс
        function lightboxReload(){

            const pictures = document.querySelectorAll('#levus-lightbox picture');

            for(let i = 0; i < length; i++){

                if(elements[i] === 0){

                    opacity = 1;
                } else {
                    
                    opacity = 0;
                }

                pictures[i].style.transform = `translateX(${elements[i]}%)`;
                pictures[i].style.opacity = opacity;
            }
        }

        // висота блоку зі слайдами залеже від найбільшого слайду
        function setMaxHeightSlider(){
            
            // беремо висоту з дата-атрибута, бо використовується блокуюча тулза -- loading="lazy"
            const dataHeight = Math.max(...[...images].map(image => image.dataset.height));

            slidesUl.style.height = `${dataHeight/2}px`;
        }

        // перемальовка елементів || render slides and thumbs
        function render(){

            //////////////////
            // render slide //
            //////////////////

            for(let i = 0; i < length; i++){

                slides[i].style.transform = `translateX(${elements[i]}%)`;

                // set opacity 1 for current
                if(elements[i] === 0){

                    slides[i].style.opacity = 1;

                    current = slides[i].dataset.id;
                    const lis = slider.querySelectorAll('.thumbs li');

                    for(let k = 0; k < length; k++){

                        if(lis[k].dataset.id === current){

                            lis[k].className = 'active';
                        } else {

                            lis[k].className = '';
                        }
                    }
                } else {
                    
                    slides[i].style.opacity = 0;
                }
            }

            ///////////////////
            // render thumbs //
            ///////////////////

            // якщо тягнули вправо || if drag to right
            if(shift > 0){
                const last = thumbs.lastElementChild;
                thumbs.prepend(last); 
            
                thumbs.style.transition = 'none';
                thumbs.style.transform = `translateX(-25%)`;
            }
            
            // якщо тягнули вліво || if drag to left
            if(shift < 0){
                const first = thumbs.firstElementChild;
                thumbs.append(first);  
        
                thumbs.style.transition = 'none';
                thumbs.style.transform = `translateX(25%)`;
            }

            setTimeout(() => {

                thumbs.style.transform = `translateX(0)`;
                thumbs.style.transition = '.5s';
            }, 60);

            /////////////////
            // render dots //
            /////////////////
            const lis = slider.querySelectorAll('.dots li');
            for(let i = 0; i < length; i++){

                lis[i].className = '';
            }
            lis[current].className = 'active';

            // view desc in bottom
            document.querySelector('#levus-lightbox-desc') && lightboxDesc(current);
        }

        // description
        function lightboxDesc(i){
            const desc = document.querySelector('#levus-lightbox-desc');

            const images = slidesUl.querySelectorAll('img');

            const alts = [];
            for(let image of images){

                alts.push(image.alt);
            }

            desc.innerHTML = alts[i];
        }
    }
}
// 23-10-2021