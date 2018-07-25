import * as React from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';


class PostMessage {
   public name: string;
   public email: string;
   public pictureUrl: string;

   constructor(socialResData: any, type: string) {
      if (type === "google") { // google response format
         this.name = socialResData.w3.ig || null;
         this.email = socialResData.w3.U3 || null;
         this.pictureUrl = socialResData.w3.Paa || null;
      }
      else if (type === "facebook") { // facebook response format
         this.name = socialResData.name || null;
         this.email = socialResData.email || null;
         this.pictureUrl = socialResData.picture.data.url || null;
      }
   }

}

function popupClosedCondition(response : any, type : any) {
   const facebookCloseCondition = response.hasOwnProperty("status") && response.status === "unknown";
   const googleCloseCondition = response.hasOwnProperty("error") && response.error === "popup_closed_by_user";
   let returnBool = false;

   if (facebookCloseCondition && type === "facebook") {
      returnBool = true;
   }
   else if (googleCloseCondition && type === "google") {
      returnBool = true;
   }
   return returnBool;
}

function dataExists(response : any, type : any) {
   const facebookDataExists = response.hasOwnProperty("userID") && type === "facebook";
   const googleDataExists = response.hasOwnProperty("googleId") && type === "google";;


   return facebookDataExists || googleDataExists;
}


// wrapped for the GoogleLogin
function SocialButton(props : any) {
   const type : string = props.type;
   let buttonData : any;

   function socialResponse(response: any) {

      console.log(response);
      
      if(popupClosedCondition(response, type)) {
         props.onPopupClosed();
      }

      if (dataExists(response, type)) {
         props.onResponseSuccesful(response);
         const message = new PostMessage(response, type);

         axios.post(
            props.postURL,
            message
         )
            .then(props.onPostSuccess)
            .catch(props.onPostError);


      }
   }

   if(type === "google") {
      buttonData = ( // google react component wrapper
         <GoogleLogin
            style={{}}
            clientId={props.clientId}

            onSuccess={socialResponse}
            onFailure={socialResponse}
            buttonText={props.btnText}
            className={props.btnClassName}
            autoLoad={false}
            onRequest={props.onPopupOpen}
         />
      );
   }
   else if(type === "facebook") {
      buttonData = ( // facebook react component wrapper
         <FacebookLogin
            appId={props.clientId}
            fields="name,email,picture"
            callback={socialResponse}
            textButton={props.btnText}
            cssClass="social-button facebook-button"
            onClick={props.onPopupOpen}
            autoLoad={false}
         />
      );
   }

   return (
      <div className={props.containerClassName}>
            {buttonData}
      </div>
   );
}

export default SocialButton;

// Example Usage
/* 
function popupClosedHandler() : void { console.log("Popup closed"); }
function popupOpenHandler() : void { console.log("Popup opened"); }
function responseSuccesfulHandler(res : any) : void { console.log("Response succesful", res); }
function postSuccesful() : void { console.dir("Post succesful"); }
function postError() : void { console.dir("Post NOT succesful"); }


ReactDOM.render(
   (
      <div>
      <SocialButton
         clientId="973616639194-in3pvi0r75qp73f0d92m034r0nq71iqm.apps.googleusercontent.com"
         type="google"

         onPopupClosed={popupClosedHandler}
         onPopupOpen={popupOpenHandler}
         onResponseSuccesful={responseSuccesfulHandler}

         onPostError={postError}
         onPostSuccess={postSuccesful}

         postURL={"http://localhost:8080/"}
         btnClassName="btn btn-primary"
         btnText={"Google login"}
         containerClassName="social-button google-button"

      />
      <SocialButton
         clientId="426789224472011"
         type="facebook"

         onPopupClosed={popupClosedHandler}
         onPopupOpen={popupOpenHandler}
         onResponseSuccesful={responseSuccesfulHandler}

         onPostError={postError}
         onPostSuccess={postSuccesful}

         postURL={"http://localhost:8080/error"}
         btnClassName="btn btn-primary"
         btnText={"FB Login"}
         containerClassName="social-button google-button"

      />
      </div>
   ),
   document.getElementById('root')); */