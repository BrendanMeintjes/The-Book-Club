
showDate = (createdDate, currentDate) => {
    const timeDiff = currentDate - createdDate;
    if (timeDiff > 60 * 60e3 && timeDiff < 24 * 60 * 60e3) {
        var time = Math.floor(timeDiff / 24 * 60 * 60e3) + "h"
    }
    if (timeDiff > 60e3 && timeDiff < 60 * 60e3) {
        var time = Math.floor(timeDiff / 60e3) + "m";
    } else if (timeDiff > 1e3 && timeDiff > 60e3) {
        var time = Math.floor(timeDiff / 1e3) + "s";
    }
};