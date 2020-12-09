export class DateUtil {

    static formatDate(unformattedDate: string) {
        const today = new Date(unformattedDate);
        const date = today.getDate();
        const month = today.getMonth() + 1; // January is 0!
        let dd = date.toString();
        let mm = month.toString();

        const yyyy = today.getFullYear();
        if (date < 10) {
            dd = '0' + date;
        }
        if (month < 10) {
            mm = '0' + month;
        }
        const formattedDate = dd + '/' + mm + '/' + yyyy;

        return formattedDate;
    }
}