export const nameCustomize = (fullName)=>{
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0]; // Always safe to access
    const lastNameInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : " "; 
    return `${firstName} ${lastNameInitial}.`;
};