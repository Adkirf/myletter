import MyLetterConfirmationEmail from "../../components/email-templates/confirmation-tempate";



export default function Preview() {
    return MyLetterConfirmationEmail({
        userEmail: "test@test.com",
        userName: "Test User",
        subscribedNewsletter: ["Test Newsletter", "Test Newsletter 2"]
    })
}