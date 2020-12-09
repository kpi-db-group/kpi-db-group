export class PaginationSortUtil {
    static customQuery(query, queryParams) {
        if (queryParams.field && queryParams.order) {
            let field = queryParams.field;
            let order = queryParams.order;
            let sort = {};
            sort[field] = order;
            return query.skip(queryParams.index * queryParams.elementsPerChunk).limit(queryParams.elementsPerChunk).collation({ locale: "en" }).sort(sort);
        } else {
            return query.skip(queryParams.index * queryParams.elementsPerChunk).limit(queryParams.elementsPerChunk);
        }
    }

    static sortPopulatedField(array, entity, field, order) {
        if (entity && field && Array.isArray(array) && array.length)  {
            let internalOrderAsc = order == 1 ? 1 : -1;
            let internalOrderAscDesc = order == 1 ? -1 : 1;
            if (!Array.isArray(array[0][entity])) {
                array.sort(function(a, b) {

                  if (!a || !a[entity] || !a[entity][field] ||
                      !b || !b[entity] || !b[entity][field]) {
                    return internalOrderAscDesc;
                  }
                    let nameA=a[entity][field].toLowerCase(), nameB=b[entity][field].toLowerCase();
                    if (nameA < nameB)
                        return internalOrderAscDesc;
                    if (nameA > nameB)
                        return internalOrderAsc;
                    return 0;
                });  
            } else {
                array.forEach(patient => {
                    patient[entity].sort(function(a, b) {
                        let nameA=a[field].toLowerCase(),
                        nameB=b[field].toLowerCase();
                        if (nameA < nameB)
                            return -1;
                        if (nameA > nameB)
                            return 1;
                        return 0;
                    })
                });
                array.sort(function(a, b) {
                    let nameA = a[entity][0] ? a[entity][0][field].toLowerCase() : '',
                    nameB = b[entity][0] ? b[entity][0][field].toLowerCase() : '';
                    if (nameA < nameB)
                        return internalOrderAscDesc;
                    if (nameA > nameB)
                        return internalOrderAsc;
                    return 0;
                })
            }
        }
    }
}