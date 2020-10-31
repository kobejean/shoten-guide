
export const relativePath = (fromPath, toPath) => {
    if (!fromPath || fromPath === '/' || fromPath === '') return toPath

    let extraSlashesCount = 0
    if (fromPath.slice(0, 1) === '/') extraSlashesCount += 1
    if (fromPath.slice(-1) === '/') extraSlashesCount += 1
    const dirCount = fromPath.split('/').length - extraSlashesCount
    return '../'.repeat(dirCount) + toPath
}

const LOCALE_PATHNAME_REPLACE_REGEX = /^.+?([/]|$)/
export const relativePathToReplaceLocale = (fromPath, locale) => {
    const newPath = fromPath.replace(LOCALE_PATHNAME_REPLACE_REGEX, locale + '/')
    return relativePath(fromPath, newPath)
}
