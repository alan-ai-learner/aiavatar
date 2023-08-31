const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_IMG = "https://cdn-icons-png.flaticon.com/128/4711/4711987.png";
const PERSON_IMG = "https://cdn-icons-png.flaticon.com/128/747/747376.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "User";

msgerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendcMessageForUser(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  appendMessageForBot(BOT_NAME, BOT_IMG, "left");

  await botResponse(msgText);
});

const fecthAudioAndText = async (text) => {
  const textResponse = await fetch("https://rntkk-2409-40e3-5b-56a-2bbf-e5bb-6722-22e7.a.free.pinggy.online/gen_text/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text }),
    redirect: "follow"
  });

  const textMsg = await textResponse.json();
  const chatText = textMsg.generated_text;
  const audioResponse = await fetch("https://rntkk-2409-40e3-5b-56a-2bbf-e5bb-6722-22e7.a.free.pinggy.online/gen_audio/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: chatText }),
    redirect: "follow"
  });

  const responseData = await audioResponse.blob();
  const audioURL = URL.createObjectURL(responseData);

  return { chatText, audioURL };
};

function appendcMessageForUser(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function appendMessageForBot(name, img, side) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">

        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div id="msg-processing" class="msg-text">Processing...</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

async function botResponse(msgText) {
  const { chatText, audioURL } = await fecthAudioAndText(msgText);

  const msgBlock = document.getElementById("msg-processing");
  msgBlock.textContent = chatText;

  msgBlock.removeAttribute("id");
  playAudioAndVideo(audioURL);
}

function playAudioAndVideo(audioURL) {
  const video = document.getElementById("myVideo");
  const videoImg = document.getElementById("logo_img_an");

  const advdContainer = document.getElementById('video_audio_block');

  const audio = document.createElement('audio');

  audio.src = audioURL;
  audio.autoplay = true;
  audio.id = "myAudio";
  audio.style.display = 'none';

  advdContainer.insertBefore(audio, advdContainer.firstChild);


  let audioEle = document.getElementById('myAudio');


  // Show the video
  video.style.display = "block";
  videoImg.style.display = "none";

  audioEle.addEventListener("ended", () => {
    audioEle.remove();
    video.style.display = "none";
    videoImg.style.display = "block";
    video.currentTime = 0;
  });
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}
