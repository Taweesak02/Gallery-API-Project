const artistResponse = (artistData)=>({
    id: artistData.id,
    user_id: artistData.user_id,
    name:artistData.name,
    sex:artistData.sex,
    birth_date:artistData.birth_date,
    nationality: artistData.nationality
})

module.exports = {artistResponse}