const currentDate = new Date();
const currentHour = currentDate.getHours();

// To displaying the greeting message base on the time
export const displayGreetingMsg = (): string => {
  if (currentHour >= 0 && currentHour < 12) {
    return "Good morning!";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good afternoon!";
  } else {
    return "Good evening!";
  }
};

// To decoding the JWT token from the client side
export const decodeJwt = (token: any) => {
  if (token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } else {
    return {};
  }
};

// To adding the line break after the specific amount of charters
export const lineBreak = (text: string, maxCharacters: number) => {
  const regex = new RegExp(`.{1,${maxCharacters}}`, "g");
  const matches = text.match(regex);
  return matches ? matches.join("\n") : "";
};

// To generating file URL for the the AWS S3 bucket
export function awsS3UrlGenerate(key: string) {
  return `https://${process.env.REACT_APP_AWS_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_S3_REGION}.amazonaws.com/${key}`;
}
