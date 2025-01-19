export const nameCustomize = (fullName)=>{
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0]; // Always safe to access
    const lastNameInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : " "; 
    return `${firstName} ${lastNameInitial}.`;
};

export const DateDisplay = (date) => {
    if(!date){
        return;
    }
    const dateObj = new Date(date); // Create a Date object
  
    // Format the Date object
    const formattedDate = dateObj.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    return formattedDate;
};