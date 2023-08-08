
export const isInteger = (input:string) => {
    return input?.match(/^d\+$/) ?? false;
}