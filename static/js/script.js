// Глобальный обработчик событий
document.addEventListener('DOMContentLoaded', () => {

    'use strict';

    const btnOpenModal = document.getElementById('btnOpenModal'),
        modalBlock = document.getElementById('modalBlock'),
        modalTitle = document.querySelector('.modal-title'),
        closeModal = document.getElementById('closeModal'),
        questionTitle = document.getElementById('question'),
        formAnswers = document.getElementById('formAnswers'),
        burgerBtn = document.getElementById('burger'),
        prevBtn = document.getElementById('prev'),
        nextBtn = document.getElementById('next'),
        sendBtn = document.getElementById('send'),
        modalDialog = document.querySelector('.modal-dialog');

    // получение данных
    const getData = () => {
        formAnswers.textContent = 'LOAD...';
        setTimeout(() => {
            fetch('./data/questions.json')
            .then(res => res.json())
            .then(obj => playTest(obj.questions))
            .catch(err => {
                formAnswers.textContent = 'Щшибка загрузки данных';
                console.error(err);
            })               
        }, 1000);    

    };
                        
    let clientWidth = document.documentElement.clientHeight;

    if (clientWidth < 768) {
        burgerBtn.style.display = 'flex';
    } else {
        burgerBtn.style.display = 'none';
    }

    window.addEventListener('resize', () => {
        clientWidth = document.documentElement.clientWidth;

        if (clientWidth < 768) {
            burgerBtn.style.display = 'flex';
        } else {
            burgerBtn.style.display = 'none';
        }
    });

    let count = -100;
    let interval;
    modalDialog.style.top = count + '%';
        
    const animateModal = () => {
        modalDialog.style.top = count + '%';
        count += 3;

        if (count < 0) {
            interval = requestAnimationFrame(animateModal);
        } else {
            count = -100;
        }
    }; 
    // Обработчик модального окна
    btnOpenModal.addEventListener('click', () => {
        interval = requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        prevBtn.classList.add('d-none');
        getData();
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    });

    burgerBtn.addEventListener('click', () => {
        interval = requestAnimationFrame(animateModal);
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        getData();
    });

    document.addEventListener('click' , (event) => {
        let target = event.target;

        if (!target.closest('.modal-dialog') &&
            !target.closest('.openModalButton') &&
            !target.closest('.burger')) {
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
        }
    });
    // Функция начала тестирования
    const playTest = (questions) => {
        const finalAnswers = [];
        const obj = {};
        // переменная с номеров вопроса
        let numberQuestion = 0;
        modalTitle.textContent = 'Ответьте на вопрос';
        // Вывод массива сответами
        const renderAnsewrs = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-between');

                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.id}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.id}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="burger">
                        <span>${answer.title}</span>
                    </label>
                `;
                formAnswers.appendChild(answerItem);
            });
        };
        // Рендер модального окна и вопросов
        const renderQuestion = (indexNumber) => {
            formAnswers.innerHTML = '';

            if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                questionTitle.textContent = `${questions[indexNumber].question}`;
                renderAnsewrs(indexNumber);    
                nextBtn.classList.remove('d-none');
                prevBtn.classList.remove('d-none');
                sendBtn.classList.add('d-none');
            }
            if (numberQuestion === 0) {
                prevBtn.classList.add('d-none');
            }
            if (numberQuestion === questions.length) {
                modalTitle.textContent = '';
                questionTitle.textContent = ``;
                nextBtn.classList.add('d-none');
                prevBtn.classList.add('d-none');
                sendBtn.classList.remove('d-none');
                formAnswers.innerHTML = `
                <div class="form-group">
                    <label for="numberPhone">Введите номер телефона</label>
                    <input type="phone" class="form-control" id="numberPhone">
                </div>            
                `;

                const numberPhone = document.getElementById('numberPhone');
                numberPhone.addEventListener('input', (event) => {
                    event.target.value = event.target.value.replace(/[^0-9+-]/, ``);
                });
            }
            if (numberQuestion === questions.length + 1) {
                modalTitle.textContent = '';
                sendBtn.classList.add('d-none');
                closeModal.classList.add('d-none');
                formAnswers.textContent = 'Спасибо за тест!';

                for (let key in obj) {
                    let newObj = {};
                    newObj[key] = obj[key];
                    finalAnswers.push(newObj);
                }

                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
            }
        };
        // Запуск рендера вопросов
        renderQuestion(numberQuestion);

        const checkAnswer = () => {

            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');
            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }
                if (numberQuestion === questions.length) {
                    obj[`Номер телефона`] = input.value;
                }
            });
        };

        // Обработчики событий кнопок выбора следующих вопросов
        nextBtn.onclick =  () => {
            checkAnswer();
            numberQuestion++;
            renderQuestion(numberQuestion);
        };
        prevBtn.onclick = () => {
            numberQuestion--;
            renderQuestion(numberQuestion);
        };
        sendBtn.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestion(numberQuestion);
        };
    };
});
