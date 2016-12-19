import ConfigParser
import numpy as np
import numbers

#class ini_parser(ConfigParser.SafeConfigParser):
#    '''
#    extended SafeConfigParser class adding as_dict method
#    '''
#    def as_dict(self):
#        d = dict(self._sections)
#        for k in d:
#            d[k] = dict(self._defaults, **d[k])
#            d[k].pop('__name__', None)
#        return d

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

def groupby_1d(data, bindef, aggalgos):
    '''
    inputs:
      data: {
        'time':...
        'val1': ...
     }
     bindef: {
        field: str,
        step_size: int | None,
        step_unit: str (number,week,month,day) | None,
        step_count: int |None,        
     }
     aggalgos: {
           "<fieldname>": str, # left, right, middle, min, max, avg, sum
           ...
     }

    outputs:
    {
         'aggregated': True/False
         'data':{
             field: array
        }
    }
    '''
    if not bindef.has_key('field'):
        raise KeyError('field not found in the bindef input, cannot decide on the binning variable')
    
    binning_field = bindef['field']    
    binning_array = data[binning_field]
    step_count = 0
    step_size = 0
    bins = 100 #well, default to 100 bins if nothing given
    if bindef.has_key('step_count') and bindef['step_count']:
        bins = bindef['step_count']
    elif not bins and bindef.has_key('step_size') and  bindef['step_size']:
        bins =  np.arange( min(binning_array), max(binning_array), bindef['step_size'] )

    if isinstance(bins, numbers.Number):
        if bins > len(binning_array): # no need of aggregation
            return { 'aggregated':False }
    else:
        if bins.size > len(binning_array): # no need of aggregation
            return { 'aggregated':False }
    (hist, bin_edges) = np.histogram( np.array(binning_array), bins=bins,  )

    outdata = dict.fromkeys(aggalgos.keys(),[])
    if not outdata.has_key(binning_field):
        outdata[ binning_field ] = []

    for i,e in enumerate( bin_edges[:-1] ):
        left_edge = e
        right_edge = bin_edges[i+1]        
        if i==(bin_edges.size-2):#if last bin, the right edge is inclusive            
            pos = np.where( (binning_array<=right_edge)&(binning_array>=left_edge) )[0]
        else:
            pos = np.where( (binning_array<right_edge)&(binning_array>=left_edge) )[0]
        
        outdata[ binning_field ].append( (left_edge+right_edge)/2. )
        for fieldname in aggalgos.keys() :
            aggalgo = aggalgos[fieldname]
            agg_array = data[fieldname]
            toaggregate = np.take(agg_array, pos)
            if len(toaggregate)==0:
                outdata[fieldname].append(None) # or zero???
                continue            
            if aggalgo=='average':
                outdata[fieldname].append( np.average(toaggregate) )
            elif aggalgo=='sum':
                outdata[fieldname].append( np.sum(toaggregate) )
            elif aggalgo=='max':
                outdata[fieldname].append( np.max(toaggregate) )
            elif aggalgo=='min':
                outdata[fieldname].append( np.min(toaggregate) )
            elif aggalgo=='left':
                outdata[fieldname].append( toaggregate[0] )
            elif aggalgo=='right':
                outdata[fieldname].append( toaggregate[-1] )
            elif aggalgo=='middle':
                if len(toaggregate)==1:
                    outdata[fieldname].append( toaggregate[0] )
                elif len(toaggregate)%2==0: #even number of elements
                    outdata[fieldname].append( toaggregate[ len(toaggregate)/2-1 ] )
                else:    
                    outdata[fieldname].append( toaggregate[ len(toaggregate)/2 ] )
    
    return {'aggregated':True, 'data':outdata}

if __name__=='__main__':    

    t = [0.2, 0.3, 0.4, 1.1, 1.2, 3.3, 3.0, 4.1, 6.2, 16.1]
    y = [1,2,3,4,5,6,7,8,9,10]

    data = {'t':t,'y':y}
    bindefdict = {'field':'t','step_count':5 }
    aggalgos = {'y':'max'}
    grouped =  groupby_1d(data, bindefdict, aggalgos)
    print grouped
