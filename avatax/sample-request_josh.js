'use strict';

var validateAddress = {
    title: 'Validate Address',
    metadata: [
        {header: 'Description', val: 'Validate an address'},
        {header: 'Endpoint', val: 'https://developer.avalara.com/1.0/address/validate'},
        {header: 'HTTP Method', val: 'GET'}
    ],
    querystring: [
        {name: 'Line1', default: '1100 2nd Ave', required: true},
        {name: 'Line2', default: 'Suite 300', required: false},
        {name: 'Line3', default: '', required: false},
        {name: 'City', default: 'Seattle', required: true},
        {name: 'Region', default: 'WA', required: false},
        {name: 'Country', default: 'United States', required: true},
        {name: 'PostalCode', default: '98103', required: true}
    ],
    postBody: null
};

var getTax = {
    title: 'Get Tax',
    metadata: [
        {header: 'Description', val: 'Calculates taxes on a document such as a sales order, sales invoice or purchase order'},
        {header: 'Endpoint', val: 'https://developer.avalara.com/1.0/tax/get'},
        {header: 'HTTP Method', val: 'POST'}
    ],
    querystring: [],
    postBody: {
        "context": {
            "resource-path": "/tax/get",
            "http-method": "POST"
        },
        "params": {
            "header": {
                "api-key": ""
            }
        },
        "body-json": {
            "DocDate": "2016-02-11",
            "CustomerCode": "0000",
            "CompanyCode": "APITrialCompany",
            "Addresses": [
                {
                    "AddressCode": "1",
                    "Line1": "435 Ericksen Avenue Northeast",
                    "Line2": "#250",
                    "PostalCode": "98110"
                }
            ],
            "Lines": [
                {
                    "LineNo": "1",
                    "DestinationCode": "1",
                    "OriginCode": "1",
                    "Qty": 1,
                    "Amount": 10
                }
            ]
        }
    }
};

$(function() {
    $('.validateAddress').on('submit', function(e) {
        e.preventDefault();
        var isValid = true;

        $('input[data-required]').each(function() {
            $(this).parent().removeClass('error');
            if (!$(this).val()) {
                $(this).parent().addClass('error');
                isValid = false;
            }
        });

        console.log('isValid', isValid);
        if (isValid) {
            var addressData = {};

            $('.validateAddress input').each(function() {
                addressData[$(this).attr('name')] = $(this).val()
            });
            console.log('addressData', addressData);

            $.ajax({
                type: 'GET',
                url: 'https://s3-us-west-2.amazonaws.com/api-proxy-key/key',
                success: function(data) {
                    console.log('s3 success', data);
                    $.ajax({
                        type: 'GET',
                        url: 'https://swn36zl7ba.execute-api.us-west-2.amazonaws.com/prod/address/validate',
                        headers: {'api-key': data},
                        data: addressData,
                        success: function(data) {
                            console.log('success', data)
                        },
                        error: function(err) {
                            console.log('ajax error', err)
                        }
                    });
                },
                error: function(err) {
                    console.log('s3 error', err)
                }
            });
        }
    });

    $('.showGetTaxSamplePost').on('click', function(e) {
        e.preventDefault();
        $('.getTaxPostBody').val(JSON.stringify(getTax.postBody['body-json'], null, 2));
    });

    $('.fillSampleAddressData').on('click', function(e) {
        e.preventDefault();
        $('.validateAddress input').each(function() {
            $(this).parent().removeClass('error');
            $(this).val($(this).attr('placeHolder'));
        });
    });
});
