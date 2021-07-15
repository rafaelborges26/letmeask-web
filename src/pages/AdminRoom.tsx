import { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Logo from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/roomCode'
//import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import '../styles/room.scss'
import deleteImg from '../assets/images/delete.svg';
import { database } from '../services/firebase'


type RoomParams = {
    id: string
}


export function AdminRoom() {
    const params = useParams<RoomParams>();
    
    const roomId = params.id

    const { questions, title } = useRoom(roomId)

    const history = useHistory();

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(), 
        })
        history.push('/')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                     <img src={Logo} alt="Letmeask"/>
                     
                     <div>
                         <RoomCode code={roomId}/>
                        <Button 
                            onClick={handleEndRoom}
                            isOutLined>
                            Encerrar salas
                        </Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>  }
                </div>

                <div className="question-list">
                {questions.map(question => {
                    return (
                        <Question key={question.id} content={question.content} author={question.author} >
                            <button 
                                type="button"
                                onClick={() => {handleDeleteQuestion(question.id)}}
                            >
                            <img src={deleteImg} alt="Remover pergunta"/>
                            </button>
                            

                        </Question>
                    )
                } )}    
                </div>
                
            </main>
        </div>
    )
}