/**
 * @param {object} infos 
 * @param {string} infos.name
 * @param {string} infos.description
 * @param {boolean} infos.boolean
 * @param {string} infos.type
 * @param {string} infos.language
 * @param {string} infos.license
 * @returns {{title: string, task: () => void | Promise<void>}}
 */
export default function (infos) {
    return [
        {
            title: 'Generating License File',
            task() {

            }
        }
    ]
}