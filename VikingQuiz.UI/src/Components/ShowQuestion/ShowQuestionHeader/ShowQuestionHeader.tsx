import * as React from 'react';
import './ShowQuestionHeader.css'
import MyProfileComponent from '../../MyProfileComponent/MyProfileComponent';
import TimerComponent from 'src/Components/TimerComponent/TimerComponent';

interface IProps {
    timer: number,
    timeout: any,
    quizPicture: string,
    quizName: string
}

const secondsInMinute: any = 60;
class ShowQuestionHeader extends React.Component<IProps, any>{
    private interval : any;

    public constructor(props: any){
        super(props);

        this.state = {
            timer: this.props.timer       
        }
    }

    public componentDidMount(){
        this.startTimer();
    }

    public componentDidUpdate(prevProps: any){
        if(this.props.timer !== prevProps.timer)
        {
            this.removeColorFromTimer();
            
            if(this.props.timer === -1){
                clearInterval(this.interval);
                this.addColorToTimer();
            }else{
                this.setState({
                    timer: this.props.timer
                })
                this.startTimer();
            }
            
        }
    }

    public timeExpired = () => {
        this.addColorToTimer();
        this.props.timeout();
    }

    public render(){
        return (
            <div className='show-header'>
                <div className='show-quiz'>
                    <MyProfileComponent profilePictureUrl={this.props.quizPicture} profileName={this.props.quizName} />
                </div>
                <div className='show-timer'>
                    <div className='time-counter'>
                        <span className='minutes'>{this.getMinutesValue(this.state.timer)}</span>:<span className='seconds'>{this.getSecondsValue(this.state.timer)}</span>
                    </div>
                    <TimerComponent seconds={this.props.timer}/>
                </div>
            </div>
        )
    }

    private getMinutesValue = (seconds: any) => {
        const noOfMinutes: number = Math.floor(seconds / secondsInMinute);
        let minutesValue: string = noOfMinutes.toString();
        if(noOfMinutes < 10){
            minutesValue = '0' + minutesValue;
        }
        return minutesValue;
    }

    private getSecondsValue = (seconds: any) => {
        const noOfSeconds: number = seconds % secondsInMinute;
        let secondsValue: string = noOfSeconds.toString();
        if(noOfSeconds < 10){
            secondsValue = '0' + secondsValue;
        }
        return secondsValue;
    }

    private addColorToTimer = () =>{
        const element: any = document.querySelector('.time-counter');
        element.classList.add('red');
    }

    private removeColorFromTimer = () =>{
        const element: any = document.querySelector('.time-counter');
        element.classList.remove('red');
    }

    private startTimer = () => {
        this.interval = setInterval(()=>{
            let timerCopy: number = this.state.timer;
            if(timerCopy === 6){
                this.addColorToTimer();
            }
            else if(timerCopy === 1){
                clearInterval(this.interval);
                this.timeExpired();
            }
            timerCopy = timerCopy - 1;
            this.setState({
                timer: timerCopy
            });
        }, 1000)
    }
}

export default ShowQuestionHeader;