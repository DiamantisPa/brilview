import ConfigParser
import numpy as np

class ini_parser(ConfigParser.SafeConfigParser):
    '''
    extended SafeConfigParser class adding as_dict method
    '''
    def as_dict(self):
        d = dict(self._sections)
        for k in d:
            d[k] = dict(self._defaults, **d[k])
            d[k].pop('__name__', None)
        return d

def blob_to_array(iblob,itypecode):
    '''
    unpack blob(buffer) to c array
    '''
    if not isinstance(iblob,buffer) and not isinstance(iblob,str):
        return None
    if itemtypecode not in ['c','b','B','u','h','H','i','I','l','L','f','d']:
        raise RuntimeError('unsupported typecode '+itemtypecode)
    result=array.array(itemtypecode)

    if not iblob :
        return None
    result.fromstring(iblob)
    return result

def groupby_1d(bins, binned_array, groupby_array, groupbyalgos ):
    '''
    aggregate array data by bins

    Input parameters:
        bins: grouping boundaries
        binned_array: the array to be divided by bins
        groupbyalgo: aggregation algorithm of the binned values ['average','sum','max','min']
        groupby_array: array to be aggregated according to the binning
        
        binned_array and groupby_array must have the same length

    Output parameters:
        groupresult = {'bin':index of the left-most element of each bin in the input array , 'algo1': resultarray}
        The arrays all have the same length 
    '''
    binindx = np.digitize( binned_array, bins, right=False )
    bins, indices = np.unique(binindx, return_index=True) # pandas unique is faster?
    #The indices of the first occurrences of the unique values
    result = {}
    result['binidx'] = indices
    result['bin'] = np.take(binned_array,indices)
    for k in bins: #loop over bins in order        
        toaggregate_index = np.where(binindx==k)
        toaggregate = np.take(groupby_array,  toaggregate_index)
        for algo in groupbyalgos:
            if not result.has_key(algo):
                result[algo] = []
            if algo=='average':
                result[algo].append( np.average(toaggregate) )
            elif algo=='sum':
                result[algo].append( np.sum(toaggregate) )
            elif algo=='max':
                result[algo].append( np.amax(toaggregate) )
            elif algo=='min':
                result[algo].append( np.amin(toaggregate) )
            elif  algo=='cumsum':
                result[algo].append( np.cumsum(toaggregate) )
    return result

if __name__=='__main__':
    iconf = ini_parser()
    iconf.read('/home/zhen/work/brilview/brilview/data/brilview.config')
    print  iconf.sections()
    print iconf.as_dict()

    bindef = [0., 1., 2.5, 4.0, 10.0]
    t = [0.2, 0.3, 0.4, 1.1, 1.2, 3.3, 3.0, 4.1, 6.2, 16.]
    y = [1,2,3,4,5,6,7,8,9,10]
    grouped = groupby_1d(bindef, t, y, ['min','max'] )
    print grouped
